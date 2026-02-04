const cron = require('node-cron');
import axios from 'axios';
import { Sport } from '../models/Sport';
import { Market } from '../models/Market';
import { Bet, BetOn } from '../models/Bet';
import { User } from '../models/User';
import { AccoutStatement, ChipsType, IAccoutStatement } from '../models/AccountStatement';
import { TxnType } from '../models/UserChip';
import { Casino } from '../models/CasinoMatches';
import { FancyController } from './FancyController';
import { CasinoGameResult } from '../models/CasinoGameResult';
import { BetController } from './BetController';
import { Balance } from '../models/Balance';
import UserSocket from '../sockets/user-socket';
import { ObjectId, Types } from 'mongoose'
import { RoleType } from '../models/Role';
import mongoose from '../providers/Database';
const fancyController = new FancyController()

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const startCronJob = () => {

  cron.schedule('*/30 * * * * *', async () => {

    const userbets = await Bet.aggregate([
      {
        $match: {
          status: 'pending',
          bet_on: BetOn.CASINO
        }
      },
      {
        $lookup: {
          from: 'casinomatches',           // Make sure the name matches MongoDB collection (usually lowercase plural)
          localField: 'matchId',
          foreignField: 'match_id',
          as: 'casinoMatch'
        }
      },
      {
        $unwind: {
          path: '$casinoMatch',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          slug: '$casinoMatch.slug'
        }
      },
      {
        $project: {
          casinoMatch: 0  // optional: remove the joined object to avoid clutter
        }
      }
    ]);

    // console.log(userbets, 'casino bets')

    const uniquePairs: { matchId: string; marketId: string; slug: string }[] = [];

    const seenPairs = new Set<string>();

    userbets.forEach((bet: any) => {
      if (!bet.matchId || !bet.marketId) return;

      const key = `${bet.matchId}_${bet.marketId}`;
      if (!seenPairs.has(key)) {
        seenPairs.add(key);
        uniquePairs.push({
          matchId: bet.matchId,
          marketId: bet.marketId,
          slug: bet.slug,
        });
      }
    });

    // console.log(uniquePairs, 'unique pairs')

    for (const match of uniquePairs) {
      let resultApi: any;
      try {
        resultApi = await axios.get(`http://69.62.123.205:3000/detailresult2/${match.slug}/${match.marketId}`)
        console.log(resultApi.data, 'result0')
      } catch (error) {
        console.log(error.message, 'error')
        continue;
      }

      if (resultApi.data) {
        // console.log(resultApi.data?.data, 'result', match.slug)
        const result = resultApi.data?.data?.t1 ?? ''
        const selectionId = result.rid;
        const resultsids = result.resultsids ?? '';
        const sid50 = result.sid50 ?? null;
        const relatedBets = userbets.filter(
          (b) => b.marketId === match.marketId && b.slug === match.slug
        );
        // console.log(relatedBets, 'bet1')
        const groupedBets: { [userId: string]: any[] } = {};
        for (const bet of relatedBets) {
          if (!groupedBets[bet.userId]) groupedBets[bet.userId] = [];
          groupedBets[bet.userId].push(bet);
        }

        const userIdList: any = [];
        const parentIdList: any = [];

        // console.log(groupedBets, 'group bets')

        for (const [userId, bets] of Object.entries(groupedBets)) {
          for (const [index, bet] of bets.entries()) {
            // Calculate profit/loss
            // console.log(bet,'bet')
            const { profitLoss } = canculatePnl({
              ItemBetList: bet,
              selectionId,
              sid50,
              resultsids: result ? result : {},
            });

            // console.log(profitLoss, 'profitloss',bet,selectionId)

            const narration = `${bet.matchName ?? ''} / Rno-${bet.marketId ?? ''}, ${profitLoss >= 0 ? 'profit' : 'loss'} [winner: ${selectionId ?? ''} ]`;

            // console.log(narration,'narration')

            // Update P&L to user
            await addprofitlosstouser({
              userId: userId,
              bet_id: bet._id,
              profit_loss: profitLoss,
              matchId: bet.matchId,
              narration,
              sportsType: bet.sportId,
              selectionId: bet.marketId,
              sportId: 5000
            });

            // console.log(profitLoss,'new calculated pnl in cron')

            await Bet.updateOne(
              { _id: bet._id },
              {
                $set: {
                  pnl: profitLoss,
                  status: 'completed'
                }
              }
            );

            // console.log('bet updated')

            // Collect for balance update
            if (index === 0) {
              bet.ratioStr?.allRatio?.forEach((r: any) => {
                parentIdList.push(r.parent);
                userIdList.push(userId);
              });
            }


          }
          userIdList.push(userId)
        }
        const unique = [...new Set(userIdList)]
        // console.log(unique, parentIdList, 'ids')
        await fancyController.updateUserAccountStatementCasino(
          unique,
          parentIdList
        );



        // await CasinoGameResult.updateMany(
        //   { mid: match.marketId, gameType: match.slug },
        //   { $set: { 'data.status': 'done', 'data.result-over': 'done' } }
        // );
      }
      else {
        console.log('else part')
        continue;
      }
    }
  })




  const canculatePnl = ({ ItemBetList, selectionId, sid50, resultsids, data }: any) => {
    sid50 = sid50 ? sid50.split(',') : ''
    let profit_type = 'loss',
      profitLossAmt = 0
    let fancy = false
    // console.log(ItemBetList, 'bet1')
    switch (ItemBetList.slug) {
      case 'queen':
      case 'card32':
      case 'cmeter':
      case 'goal':
        // case 'card32eu':
        let winners = resultsids.rdesc.split('#');

        profit_type =
          ItemBetList.isBack === true && winners.includes(ItemBetList.selectionName)
            ? 'profit'
            : ItemBetList.isBack === false && !winners.includes(ItemBetList.selectionName)
              ? 'profit'
              : 'loss'
        if (profit_type == 'profit') {
          if (ItemBetList.isBack === true) {
            profitLossAmt =
              (parseFloat(ItemBetList.odds.toString()) - 1) *
              parseFloat(ItemBetList.stack.toString())
          } else if (ItemBetList.isBack === false) {
            profitLossAmt = parseFloat(ItemBetList.stack.toString())
          }
        } else if (profit_type == 'loss') {
          if (ItemBetList.isBack === true) {
            profitLossAmt = parseFloat(ItemBetList.stack.toString()) * -1
          } else if (ItemBetList.isBack === false) {
            profitLossAmt =
              (parseFloat(ItemBetList.odds.toString()) - 1) *
              parseFloat(ItemBetList.stack.toString()) *
              -1
          }
        }
        break
      case 'lucky7':
      case 'lucky7eu':
      case 'lucky7eu2':
      case 'lucky5':
      case 'btable':
      case 'aaa':
      case 'aaa2':
      case 'AAA':
      case 'dt20':
      case 'dt202':
      case 'dtl20':
      case 'dt6':
      case 'card32eu':
      case 'war':
      case 'ab20':
      case 'abj':
        if (resultsids) {
          // console.log(resultsids, 'bet')
          let winners = resultsids.rdesc.split('#');
          let card = ItemBetList.selectionName.split(' ')
          let isCard = card[0] == 'Card' ? true : false
          let totalPoints = 0
          let result: any;
          if (
            ItemBetList.slug === 'dt20' ||
            ItemBetList.slug === 'dt202' ||
            ItemBetList.slug === 'dt6' ||
            ItemBetList.slug === 'dtl20'
          ) {
            let parts = resultsids.rdesc.split(/[#|]/);
            const winners = parts.map((part: any) => part.trim());

            const suits = {
              'Spade': 'SS',
              'Diamond': 'DD',
              'Club': 'CC',
              'Heart': 'HH'
            };


            let card = ItemBetList.selectionName.split(' ');

            // 🔁 Add "Lion" to index logic
            const index =
              card[0] === 'Dragon' ? 0 :
                card[0] === 'Tiger' ? 1 :
                  card[0] === 'Lion' ? 2 :
                    -1;

            // ✅ case 1
            let case1 = winners.includes(ItemBetList.selectionName);

            // ✅ case 2
            let case2 = ItemBetList.selectionName === 'Pair' && !winners.includes('No');

            // ✅ case 3: Card match
            let case3 = card[1] === 'Card' &&
              (
                (card[0] === 'Dragon' && resultsids.card.split(',')[0].includes(card[2])) ||
                (card[0] === 'Tiger' && resultsids.card.split(',')[1].includes(card[2])) ||
                (card[0] === 'Lion' && resultsids.card.split(',')[2]?.includes(card[2])) // safe optional check
              );

            // ✅ case 4: Suit match
            let case4 = false;
            for (const [suit, code] of Object.entries(suits)) {
              if (
                card.includes(suit) &&
                index !== -1 &&
                resultsids.card.split(',')[index]?.includes(code)
              ) {
                case4 = true;
                break;
              }
            }



            // ✅ case 5: Pair match (e.g., D : Even or L : Black)
            let case5 = false;
            let key = card[0] === 'Dragon' ? 'D' :
              card[0] === 'Tiger' ? 'T' :
                card[0] === 'Lion' ? 'L' :
                  null;

            let pair = card[1];

            if (key) {
              for (const item of parts) {
                if (item.includes(':')) {
                  const [key1, value1] = item.split(':').map((s: string) => s.trim());
                  if (key1 === key && value1 === pair) {
                    case5 = true;
                    break;
                  }
                }
              }
            }

            let case6 = false;
            if (ItemBetList.selectionName == 'Line 1' && winners.includes('1 2 3')) {
              case6 = true
            } else if (ItemBetList.selectionName == 'Line 2' && winners.includes('4 5 6')) {
              case6 = true
            } else if (ItemBetList.selectionName == 'Line 3' && winners.includes('8 9 10')) {
              case6 = true
            } else if (ItemBetList.selectionName == 'Line 3' && winners.includes('J Q K')) {
              case6 = true
            }

            result = case1 || case2 || case3 || case4 || case5 || case6;
          } else if (ItemBetList.slug === 'dt20') {
            result = winners.includes(ItemBetList.selectionName) || (isCard && resultsids.card.includes(card[1])) || (ItemBetList.selectionName === 'Odd' && winners.includes('Yes')) || (winners.includes(ItemBetList.marketName))
          } else if (ItemBetList.slug === 'card32eu') {
            let parts = resultsids.rdesc.split(/[#|~]/);
            const winners = parts.map((part: any) => part.trim());
            const bet = ItemBetList.selectionName;
            const case1 = winners.includes(bet);
            const case2 = bet.includes('Single') && winners.includes(bet.at(-1))
            const case3 = (bet === 'Any Three Card Black' && winners.includes('Black')) || (bet === 'Any Three Card Red' && winners.includes('Red')) || (bet === 'Two Black Two Red' && winners.includes('2-2'));
            const case4 = (bet === '8 & 9 Total' && winners.includes('8-9')) || (bet === '10 & 11 Total' && winners.includes('10-11'))
            let case5 = false;
            if (bet.includes('Even') || bet.includes('Odd')) {
              for (const winner of winners) {
                if (winner.includes(':')) {
                  const newWinner = winner.split(':').map((item: any) => item.trim());
                  const betPart = bet.split(' ');
                  if ((bet.includes('Even') && newWinner[1] === 'Even' && newWinner[0] === betPart[1]) || (bet.includes('Odd') && newWinner[1] === 'Odd' && newWinner[0] === betPart[1])) {
                    case5 = true;
                    break;
                  }
                }
              }
            }
            result = case1 || case2 || case3 || case4 || case5;
          } else if (ItemBetList.slug === 'ab20') {
            let parts = resultsids.rdesc.split(',').map(Number);
            let max = Math.max(...parts);
            let index = parts.indexOf(max);
            if (max >= 100) {
              let lastTwo = max % 100;
              let firstPart = Math.floor(max / 100);

              // Step 4: Replace max with the two parts
              parts.splice(index, 1, firstPart, lastTwo);
            }

            result = parts.includes(ItemBetList.selectionId);
          } else if (ItemBetList.slug === 'abj') {
            // console.log('step1',resultsids)
            const bet = ItemBetList.selectionName;
            //  console.log('step2',bet)
            const winners = resultsids.rdesc.split('#').map((item: any) => item.trim());
            //  console.log('step3',winners)
            let case1 = false;
            if (bet.includes('Joker')) {
              if (winners.includes(bet.split(' ')[1])) {
                case1 = true;
              }
            }
            else {
              if ((bet.includes('Andar') && winners.includes('Andar')) || (bet.includes('Bahar') && winners.includes('Bahar'))) {
                case1 = true;
              }
            }
            result = case1;
          }
          else {
            result = winners.includes(ItemBetList.selectionName) || (isCard && resultsids.card.includes(card[1]))
          }

          // console.log(result, 'result')
          profit_type =
            ItemBetList.isBack === true && result
              ? 'profit'
              : ItemBetList.isBack === false &&
                !result
                ? 'profit'
                : 'loss'

          if (ItemBetList.gtype == 'cmeter2020') {
            totalPoints = parseInt(data.C1) - parseInt(data.C2)
            if (Math.abs(totalPoints) > 50) totalPoints = 50
            profit_type = `SID${ItemBetList.selectionId}` === data.resultsids ? 'profit' : 'loss'

            // CMeter20 9HH and 10HH win logic
            if (ItemBetList.selectionId == 1 && data.C3 == 1) {
              totalPoints = totalPoints - 18
              profit_type = parseInt(data.C1) - 9 > parseInt(data.C2) + 9 ? 'profit' : 'loss'
            }

            if (ItemBetList.selectionId == 2 && data.C4 == 1) {
              totalPoints = totalPoints + 20
              profit_type = parseInt(data.C2) - 10 > parseInt(data.C1) + 10 ? 'profit' : 'loss'
            }
          }

          // console.log(profit_type, 'profittype')

          if (profit_type == 'profit') {
            if (ItemBetList.isBack === true) {
              profitLossAmt =
                (parseFloat(ItemBetList.odds.toString()) - 1) *
                parseFloat(ItemBetList.stack.toString())
            } else {
              profitLossAmt = parseFloat(ItemBetList.stack.toString())
            }
          } else if (profit_type == 'loss') {
            profitLossAmt = parseFloat(ItemBetList.loss.toString())

            if (ItemBetList.isBack === false) {
              profitLossAmt = -(
                (parseFloat(ItemBetList.odds.toString()) - 1) *
                parseFloat(ItemBetList.stack.toString())
              )
            }
          }

          // console.log(profitLossAmt,'amountt')

          // if (sid50 && (ItemBetList.gtype !== 'dt20' || ItemBetList.gtype !== 'dt20b')) {
          //   console.log('step11')
          //   profitLossAmt = sid50.includes(`SID${ItemBetList.selectionId}`)
          //     ? (ItemBetList.stack / 2) * -1
          //     : profitLossAmt
          // }

          // if (sid50 && (ItemBetList.gtype === 'dt20' || ItemBetList.gtype === 'dt20b')) {
          //    console.log('step12')
          //   profitLossAmt = sid50.includes(`SID${ItemBetList.selectionId}`)
          //     ? (parseFloat(ItemBetList.odds.toString()) - 1) *
          //     parseFloat(ItemBetList.stack.toString())
          //     : profitLossAmt
          // }

          // if (
          //   ItemBetList.gtype === 'ddb' &&
          //   ItemBetList.selectionId == 7 &&
          //   ItemBetList.isBack === false &&
          //   data['C1'].slice(0, -2) === 'Q'
          // ) {
          //    console.log('step13')
          //   profitLossAmt = parseFloat(ItemBetList.stack.toString())
          // }

          // if (ItemBetList.gtype === 'cmeter2020') {
          //    console.log('step14')
          //   if (profit_type == 'profit') {
          //     profitLossAmt =
          //       (parseFloat(ItemBetList.odds.toString()) - 1) *
          //       parseFloat(ItemBetList.stack.toString()) *
          //       Math.abs(totalPoints)
          //   } else {
          //     profitLossAmt =
          //       -(parseFloat(ItemBetList.odds.toString()) - 1.15) *
          //       parseFloat(ItemBetList.stack.toString()) *
          //       Math.abs(totalPoints)
          //   }

          //   ItemBetList.volume = profit_type === 'profit' ? totalPoints : -Math.abs(totalPoints)
          // }
        }
        break
      case 'baccarat':
      case 'baccarat2':
        if (resultsids) {
          const winners = resultsids.rdesc.split('#');
          const selectionParts = ItemBetList.selectionName.split(' ');
          const selectionType = selectionParts[0];
          const scoreRange = selectionParts[1]?.split('-').map(Number) || [];

          const isDirectWinner = winners.includes(ItemBetList.selectionName);

          const isPerfectPair = ItemBetList.selectionName === 'Perfect Pair' && winners[2] === 'Yes';
          const isEitherPair = ItemBetList.selectionName === 'Either Pair' && winners[3] === 'Yes';

          const isScoreBet = selectionType === 'Score' && !isNaN(Number(winners[2]));
          const isScoreMatch = isScoreBet && (
            scoreRange.length === 1
              ? Number(winners[2]) === scoreRange[0]
              : Number(winners[2]) >= scoreRange[0] && Number(winners[2]) <= scoreRange[1]
          );

          const result = isDirectWinner || isPerfectPair || isEitherPair || isScoreMatch;

          profit_type = result ? 'profit' : 'loss'
          if (profit_type == 'profit') {
            profitLossAmt = parseFloat(ItemBetList.pnl)
            if (ItemBetList.odds == 1)
              profitLossAmt =
                parseFloat(ItemBetList.odds.toString()) * parseFloat(ItemBetList.stack.toString())
            else if (ItemBetList.odds > 0 || ItemBetList.odds < 1)
              profitLossAmt =
                (parseFloat('1') + parseFloat(ItemBetList.odds.toString())) *
                parseFloat(ItemBetList.stack.toString()) -
                parseFloat(ItemBetList.stack.toString())
            else
              profitLossAmt =
                (parseFloat(ItemBetList.odds.toString()) - 1) *
                parseFloat(ItemBetList.stack.toString())
          } else if (profit_type == 'loss') {
            profitLossAmt = parseFloat(ItemBetList.stack.toString()) * -1
          }
          if (selectionId == 3 && (ItemBetList.selectionId == 1 || ItemBetList.selectionId == 2)) {
            profitLossAmt = 0
            profit_type = 'profit'
          }
          if (sid50) {
            profitLossAmt = sid50.includes(`sid${ItemBetList.selectionId}`)
              ? ItemBetList.stack / 2
              : profitLossAmt
          }
        }
        break
      case 'poker':
      case 'poker20':
      case 'teen':
      case 'teen3':
      case 'teen33':
      case 'teen32':
      case 'teen41':
      case 'teen42':
      case 'teen20':
      case 'teen20a':
      case 'teen20b':
      case 'teen20c':
      case 'poker6':
      case 'teen8':
      case 'teen9':
      case 'worli2':
      case 'dum10':
      case 'trio':
      case 'teensin':
      case 'teen1':
      case 'teenmuf':
      case 'trap':
      case 'race17':
      case 'raulette11':
      case 'raulette12':
      case 'raulette13':
        if (resultsids) {
          // if (ItemBetList.gtype === 'worliinstant' && ItemBetList.selectionId > 10) {
          //   ItemBetList.odds = 5
          // }
          // if (ItemBetList.gtype == 'Tp1Day') {
          //   ItemBetList.odds = ItemBetList.odds / 100 + 1
          // }
          if (resultsids) {
            let result: any = false;
            if (ItemBetList.slug == 'poker' || ItemBetList.slug == 'poker6' || ItemBetList.slug == 'poker20') {
              let parts = resultsids.rdesc.split(/[#|]/);
              const winners = parts.map((part: any) => part.trim());
              const case1 = winners.includes(ItemBetList.selectionName);
              let case2 = false;
              const bet = ItemBetList.marketName.split(' ')
              for (let winner of winners) {
                if (winner.includes(':')) {
                  const newWinner = winner.split(':').map((item: any) => item.trim());
                  if (newWinner[0] == bet[1] && newWinner[1] == bet[0]) {
                    case2 = true;
                  }
                }
              }
              result = case1 || case2;
            } else if (ItemBetList.slug == 'teen' || ItemBetList.slug == 'teen3' || ItemBetList.slug == 'teen32' || ItemBetList.slug == 'teen33' || ItemBetList.slug == 'teen41' || ItemBetList.slug == 'teen42') {
              // console.log('step1')
              let parts = resultsids.rdesc.split('#');
              let bet = ItemBetList.selectionName.split(' ');
              let plus = ['Pair', 'Flush', 'Straight', 'Trio', 'Straight Flush'];
              const winners = parts.map((part: any) => part.trim());
              const case1 = winners.includes(ItemBetList.selectionName);
              let case2 = false;
              if (bet.includes('Pair')) {
                winners.forEach((winner: any) => {
                  if (winner.includes(':')) {
                    let newWinner = winner.split(':').map((item: any) => item.trim())
                    if (bet.at(-1) == newWinner[0] && plus.includes(newWinner[1])) {
                      case2 = true;
                    }
                  }
                })
              }
              let case3 = false;
              if (ItemBetList.slug == 'teen41' || ItemBetList.slug == 'teen42') {
                if ((bet.includes('Under') && resultsids.rdesc.includes('Under')) || (bet.includes('Over') && resultsids.rdesc.includes('Over'))) {
                  case3 = true;
                }
              }
              // console.log(case1,case2,'step2')
              result = case1 || case2 || case3
            } else if (ItemBetList.slug == 'teen8') {
              // console.log('step1')
              let parts = resultsids.rdesc.split('#');
              // console.log(parts,'parts')
              let plus = ['Pair', 'Flush', 'Straight', 'Trio', 'Straight Flush'];
              const winners = parts.map((part: any) => part.trim());
              const bet = ItemBetList.selectionName;
              const case1 = bet.includes('Player') && winners[0].includes(bet.at(-1));
              // console.log(case1,'step middle')
              let case2 = false;
              if (bet.includes('Pair')) {
                winners.forEach((winner: any) => {
                  if (winner.includes(':')) {
                    let newWinner = winner.split(':').map((item: any) => item.trim())
                    if (bet.at(-1) == newWinner[0] && plus.includes(newWinner[1])) {
                      case2 = true;
                    }
                  }
                })
              }
              // console.log(case1,case2,'step2')
              result = case1 || case2;
            } else if (ItemBetList.slug == 'teen9' || ItemBetList.slug == 'war') {
              let parts = resultsids.rdesc.split(/[#|]/);
              const winners = parts.map((part: any) => part.trim());
              let case1 = false;
              const bet = ItemBetList.selectionName.split(' ');
              if (bet.includes('Winner')) {
                if (winners[0].includes(bet[1])) {
                  case1 = true;
                }

              } else {
                for (let winner of winners) {
                  if (winner.includes(':')) {
                    let newWinner = winner.split(':').map((item: any) => { item.trim() });
                    if (bet[1].includes(newWinner[0]) && bet[0] == newWinner[1]) {
                      case1 = true;
                      break;
                    }
                  }
                }
              }
              result = case1;
            } else if (ItemBetList.slug == 'worli2') {
              const winner = resultsids.win;
              let case1 = false;
              if (ItemBetList.selectionName.split(' ')[0] == winner) {
                case1 = true;
              } else if (ItemBetList.selectionName == 'Line 1 Single' && (winner == '1' || winner == '2' || winner == '3' || winner == '4' || winner == '5')) {
                case1 = true;
              } else if (ItemBetList.selectionName == 'Line 2 Single' && (winner == '6' || winner == '7' || winner == '8' || winner == '9' || winner == '0')) {
                case1 = true;
              } else if (ItemBetList.selectionName == 'Odd Single' && (winner == '1' || winner == '3' || winner == '5' || winner == '7' || winner == '9')) {
                case1 = true;
              } else if (ItemBetList.selectionName == 'Even Single' && (winner == '0' || winner == '2' || winner == '4' || winner == '6' || winner == '8')) {
                case1 = true;
              }
              result = case1;
            } else if (ItemBetList.slug == 'dum10') {
              let parts = resultsids.rdesc.split('|').at(-1).split('#');
              const winners = parts.map((part: any) => part.trim());
              console.log(winners, ItemBetList.selectionName, '10 ka dum');
              if ((ItemBetList.selectionName.includes('Next Total') && winners[0] == 'Yes') || (winners.includes(ItemBetList.selectionName))) {
                result = true;
              }
            } else if (ItemBetList.slug == 'trio') {
              let parts = resultsids.rdesc.split(/[#|]/);
              const winners = parts.map((part: any) => part.trim());
              console.log(winners, ItemBetList.selectionName, 'Trio');
              if ((ItemBetList.selectionName == 'Session' && winners[0].includes('Yes')) || (winners.some(item => ItemBetList.selectionName.includes(item)))) {
                result = true;
              }
            } else if (ItemBetList.slug == 'teensin') {
              let parts = resultsids.rdesc.split("#");
              const winners = parts.map((part: any) => part.trim());
              let case1 = false;
              let case2 = false;
              let case3 = false;
              let case4 = false;
              let case5 = false;
              if ((winners[0].includes(ItemBetList.selectionName))) {
                case1 = true;
              } else if (ItemBetList.selectionName == 'Lucky 9' && winners.at(-1) == 'Yes') {
                case2 = true;
              } else if ((ItemBetList.selectionName.includes('High Card')) && (winners[1]?.includes(ItemBetList.selectionName.at(-1)))) {
                case3 = true;
              } else if ((ItemBetList.selectionName.includes('Pair')) && (winners[2]?.includes(ItemBetList.selectionName.at(-1)))) {
                case4 = true;
              } else if ((ItemBetList.selectionName.includes('Color Plus')) && (winners[3]?.includes(ItemBetList.selectionName.at(-1)))) {
                case5 = true;
              }

              result = case1 || case2 || case3 || case4 || case5;
            } else if (ItemBetList.slug == 'teen1') {
              let parts = resultsids.rdesc.split("#");
              const winners = parts.map((part: any) => part.trim());
              if ((winners[0].includes(ItemBetList.selectionName))) {
                result = true;
              } else if (ItemBetList.selectionName.includes(7)) {
                const [p, d] = winners[1].split("|");
                const player = p.split(":")[1].trim();  // Up or Down
                const dealer = d.split(":")[1].trim();  // Up or Down
                const parts = ItemBetList.selectionName.split(" ");
                const direction = parts[1]; // Up / Down
                const side = parts[2];      // Player / Dealer

                // Decide winner
                if (side === "Player" && direction === player) {
                  result = true;
                };
                if (side === "Dealer" && direction === dealer) {
                  result = true;
                };

              }
            } else if (ItemBetList.slug == 'teenmuf') {
              let parts = resultsids.rdesc.split("#");
              const winners = parts.map((part: any) => part.trim());
              if ((winners[0].includes(ItemBetList.selectionName))) {
                result = true;
              } else if (ItemBetList.selectionName.includes('Top 9') && winners[1].includes(ItemBetList.selectionName.at(-1))) {
                result = true;
              } else if (ItemBetList.selectionName.includes('Baccarat') && winners[2].includes(ItemBetList.marketName)) {
                result = true;
              }
            } else if (ItemBetList.slug == 'teen20' || ItemBetList.slug == 'teen20b' || ItemBetList.slug == 'teen20c') {
              let parts = resultsids.rdesc.split("#");
              const winners = parts.map((part: any) => part.trim());
              if ((winners[0].includes(ItemBetList.selectionName))) {
                result = true;
              } else if (ItemBetList.selectionName.includes('Baccarat') && winners[1].includes(ItemBetList.marketName)) {
                result = true;
              } else if (ItemBetList.selectionName.includes('Total') && winners[2].includes(ItemBetList.marketName)) {
                result = true;
              } else if (ItemBetList.selectionName.includes('Pair') && winners[3].includes(ItemBetList.selectionName.at(-1))) {
                result = true;
              } else {
                const [p1, p2] = winners.at(-1).split("|");
                const [c, p] = ItemBetList.selectionName.split(' ');
                if ((p == 'A' && p1.includes(c)) || (p == 'B' && p2.includes(c))) {
                  result = true
                }

              }

            } else if (ItemBetList.slug == 'trap') {
              let parts = resultsids.rdesc.split("#");
              const winners = parts.map((part: any) => part.trim());
              if (ItemBetList.selectionName.includes('Player') && winners[0].includes(ItemBetList.selectionName)) {
                result = true
              } else if (ItemBetList.marketName == 'Low High') {
                let options = winners[1].split(',');
                let betValue = ItemBetList.selectionName.split('-')[0].trim();
                let cardNo = ItemBetList.selectionName.split(' ').at(-1);
                if (options[+cardNo - 1] == betValue) {
                  result = true
                }
              } else if (ItemBetList.marketName == 'JQK') {
                let options = winners[2].split(',');
                let cardNo = ItemBetList.selectionName.split(' ').at(-1);
                if (options[+cardNo - 1] == 'Yes') {
                  result = true
                }
              }
            } else if (ItemBetList.slug == 'teen120') {
              let parts = resultsids.rdesc.split("#");
              const winners = parts.map((part: any) => part.trim());
              if (winners.includes(ItemBetList.selectionName)) {
                result = true
              } else if (ItemBetList.selectionName.includes('Pair') && winners[1] == 'Yes') {
                result = true
              }

            } else if (ItemBetList.slug == 'race17') {
              let parts = resultsids.rdesc.split("#");
              const winners = parts.map((part: any) => part.trim());
              if (ItemBetList.selectionName == 'Race to 17' && winners[0].includes('Yes')) {
                result = true
              } else if (ItemBetList.marketName == 'Big Card') {
                let betCard = ItemBetList.selectionName.at(-1);
                let options = winners[1].split("  ");
                if (options[+betCard - 1] == 'Big') {
                  result = true;
                }
              } else if (ItemBetList.marketName == 'Zero Card') {
                let betCard = ItemBetList.selectionName.at(-1);
                let options = winners[2].split("  ");
                if (options[+betCard - 1] == 'Yes') {
                  result = true;
                }
              } else if (ItemBetList.marketName == 'Any Zero' && winners.at(-1) == 'Yes') {
                result = true;
              }
            } else if (ItemBetList.slug == 'roulette11' || ItemBetList.slug == 'roulette12' || ItemBetList.slug == 'roulette13') {
              const winner = resultsids.win;
              const num = parseInt(winner);
              const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, , 34, 36]
              if (ItemBetList.selectionName == winner) {
                result = true
              } else if (ItemBetList.selectionName == '1st 12' && (num >= 1 && num <= 12)) {
                result = true
              } else if (ItemBetList.selectionName == '2nd 12' && (num >= 13 && num <= 24)) {
                result = true
              } else if (ItemBetList.selectionName == '3rd 12' && (num >= 25 && num <= 36)) {
                result = true
              } else if (ItemBetList.selectionName == '1 to 18' && (num >= 1 && num <= 18)) {
                result = true
              } else if (ItemBetList.selectionName == '19 to 36' && (num >= 19 && num <= 36)) {
                result = true
              } else if (ItemBetList.selectionName.split(',').includes(winner)) {
                result = true
              } else if (ItemBetList.selectionName == '1st Column' && num % 3 == 1) {
                result = true
              } else if (ItemBetList.selectionName == '2nd Column' && num % 3 == 2) {
                result = true
              } else if (ItemBetList.selectionName == '3rd Column' && num % 3 == 0) {
                result = true
              } else if (ItemBetList.selectionName == 'Even' && num % 2 == 0 && num != 0) {
                result = true
              } else if (ItemBetList.selectionName == 'Odd' && num % 2 != 0) {
                result = true
              } else if (ItemBetList.selectionName == 'Red' && red.includes(num)) {
                result = true
              } else if (ItemBetList.selectionName == 'Black' && !red.includes(num)) {
                result = true
              }
            }

            profit_type =
              ItemBetList.isBack === true &&
                result
                ? 'profit'
                : ItemBetList.isBack === false &&
                  !result
                  ? 'profit'
                  : 'loss'
          } else {
            profit_type =
              ItemBetList.isBack === true && ItemBetList.selectionId == selectionId
                ? 'profit'
                : ItemBetList.isBack === false && ItemBetList.selectionId != selectionId
                  ? 'profit'
                  : 'loss'
          }

          if (profit_type == 'profit') {
            // console.log('Its Profit')
            if (ItemBetList.isBack === true) {
              // console.log('isBack true')
              console.log(ItemBetList.odds.toString(), '<--odds')
              console.log(ItemBetList.stack.toString(), '<--stack')
              profitLossAmt =
                (parseFloat(ItemBetList.odds.toString()) - 1) *
                parseFloat(ItemBetList.stack.toString())
            } else if (ItemBetList.isBack === false) {
              // console.log('isBack false')
              // console.log(ItemBetList.odds.toString(),'<--odds')
              // console.log(ItemBetList.stack.toString(),'<--stack')
              profitLossAmt = parseFloat(ItemBetList.stack.toString())
            }


            // console.log(profit_type,profitLossAmt,'step3')
            // profitLossAmt =
            //   (parseFloat(ItemBetList.odds.toString()) - 1) *
            //   parseFloat(ItemBetList.stack.toString())
          } else if (profit_type == 'loss') {
            //  console.log('Its Loss')
            if (ItemBetList.isBack === true) {
              // console.log('isBack true')
              // console.log(ItemBetList.odds.toString(),'<--odds')
              // console.log(ItemBetList.stack.toString(),'<--stack')
              profitLossAmt = parseFloat(ItemBetList.stack.toString()) * -1
            }
            else {
              // console.log('isBack false')
              // console.log(ItemBetList.odds.toString(),'<--odds')
              // console.log(ItemBetList.stack.toString(),'<--stack')
              profitLossAmt =
                (parseFloat(ItemBetList.odds.toString()) - 1) *
                parseFloat(ItemBetList.stack.toString()) *
                -1
            }



            if (ItemBetList.gtype == 'worliinstant') {
              if (ItemBetList.selectionId > 10) {
                profitLossAmt =
                  parseFloat(ItemBetList.odds.toString()) *
                  parseFloat(ItemBetList.stack.toString()) *
                  -1
              } else {
                profitLossAmt = parseFloat(ItemBetList.stack.toString()) * -1
              }
            }
          }
          // console.log(profitLossAmt,'profitLoss0')
          // if (data.abandoned) {
          //   profitLossAmt = 0
          //   profit_type = 'profit'
          // }
          // if (sid50) {
          //   profitLossAmt = sid50.includes(`SID${ItemBetList.selectionId}`)
          //     ? ItemBetList.stack / 2
          //     : profitLossAmt
          // }
        }
        break
      case 'race2020':
        if (resultsids) {
          let parts = resultsids.rdesc.split("#");
          const winners = parts.map((part: any) => part.trim());
          const totalPoints = winners[1];
          const totalCards = winners[2];
          if (ItemBetList.selectionId == 5) {
            // This logic for total points
            profit_type =
              ItemBetList.isBack == false && parseInt(totalPoints) < parseInt(ItemBetList.odds)
                ? 'profit'
                : profit_type
            profit_type =
              ItemBetList.isBack == true && parseInt(totalPoints) >= parseInt(ItemBetList.odds)
                ? 'profit'
                : profit_type
            fancy = true
          } else if (ItemBetList.selectionId == 6) {
            // This logic for total cards
            profit_type =
              ItemBetList.isBack == false && parseInt(totalCards) < parseInt(ItemBetList.odds)
                ? 'profit'
                : profit_type
            profit_type =
              ItemBetList.isBack == true && parseInt(totalCards) >= parseInt(ItemBetList.odds)
                ? 'profit'
                : profit_type
            fancy = true
          } else if (ItemBetList.marketName == 'K Market' && ItemBetList.selectionId == resultsids.win) {
            profit_type =
              ItemBetList.isBack == false && ItemBetList.selectionId != resultsids.win
                ? 'profit'
                : profit_type
            profit_type =
              ItemBetList.isBack == true && ItemBetList.selectionId == resultsids.win
                ? 'profit'
                : profit_type

          }
          else {
            let betval = ItemBetList.selectionId.split(' ').at(-1);
            profit_type =
              ItemBetList.isBack === true && parseInt(betval) == parseInt(totalCards)
                ? 'profit'
                : ItemBetList.isBack === false &&
                  !(parseInt(betval) == parseInt(totalCards))
                  ? 'profit'
                  : 'loss'
          }
        }


        if (profit_type == 'profit') {
          if (fancy) {
            profitLossAmt = ItemBetList.isBack
              ? (parseFloat(ItemBetList.volume) * parseFloat(ItemBetList.stack)) / 100
              : ItemBetList.stack
          } else {
            profitLossAmt = ItemBetList.isBack
              ? (parseFloat(ItemBetList.odds.toString()) - 1) *
              parseFloat(ItemBetList.stack.toString())
              : ItemBetList.stack
          }
        } else {
          if (fancy) {
            profitLossAmt = ItemBetList.isBack
              ? -ItemBetList.stack
              : -(parseFloat(ItemBetList.volume) * parseFloat(ItemBetList.stack)) / 100
          } else {
            profitLossAmt = ItemBetList.isBack
              ? -ItemBetList.stack
              : -(
                (parseFloat(ItemBetList.odds.toString()) - 1) *
                parseFloat(ItemBetList.stack.toString())
              )
          }
        }
        break
      case 'Superover':
      case 'fivewicket':
        // This sids for superover
        if ([3, 5].indexOf(parseInt(ItemBetList.selectionId.toString())) > -1) {
          fancy = true
        }
        if (
          ItemBetList.marketName.indexOf('Fancy Market') > -1 &&
          ItemBetList.gtype == 'fivewicket'
        ) {
          fancy = true
        }

        if (ItemBetList.marketName.indexOf('Fancy Market') > -1 && resultsids) {
          profit_type =
            ItemBetList.isBack === true && parseInt(data.totalRuns) >= parseInt(ItemBetList.odds)
              ? 'profit'
              : ItemBetList.isBack === false &&
                parseInt(data.totalRuns) < parseInt(ItemBetList.odds)
                ? 'profit'
                : 'loss'

          profitLossAmt = profitLossCalculation({
            ItemBetList,
            profit_type,
            profitLossAmt,
            fancy,
          })
        } else if (ItemBetList.marketName.indexOf('Fancy1 Market') > -1) {
          profit_type =
            ItemBetList.isBack === true && resultsids.indexOf(`SID${ItemBetList.selectionId}`) > -1
              ? 'profit'
              : ItemBetList.isBack === false &&
                !(resultsids.indexOf(`SID${ItemBetList.selectionId}`) > -1)
                ? 'profit'
                : 'loss'
          profitLossAmt = profitLossCalculation({
            ItemBetList,
            profit_type,
            profitLossAmt,
            fancy,
          })
        } else if (selectionId) {
          profit_type =
            ItemBetList.isBack === true && ItemBetList.selectionId == selectionId
              ? 'profit'
              : ItemBetList.isBack === false && ItemBetList.selectionId != selectionId
                ? 'profit'
                : 'loss'
          profitLossAmt = profitLossCalculation({
            ItemBetList,
            profit_type,
            profitLossAmt,
            fancy,
          })
        }
        break
      case '3cardj':
        const userCards = [ItemBetList.C1, ItemBetList.C2, ItemBetList.C3]
        const cardValues: any = {
          '2': 2,
          '3': 3,
          '4': 4,
          '5': 5,
          '6': 6,
          '7': 7,
          '8': 8,
          '9': 9,
          '10': 10,
          J: 'J',
          Q: 'Q',
          K: 'K',
          A: 1,
        }
        const resultCards = [
          cardValues[resultsids.win[0]],
          cardValues[resultsids.win[1]],
          cardValues[resultsids.win[2]],
        ]

        const winner = userCards.reduce((isCard, card) => {
          if (resultCards.includes(card)) isCard = true
          return isCard
        }, false)

        if (ItemBetList.isBack && winner) {
          profit_type = 'profit'
        } else if (ItemBetList.isBack === false && !winner) {
          profit_type = 'profit'
        } else {
          profit_type = 'loss'
        }

        if (profit_type == 'profit') {
          profitLossAmt = ItemBetList.isBack
            ? (parseFloat(ItemBetList.odds.toString()) - 1) *
            parseFloat(ItemBetList.stack.toString())
            : ItemBetList.stack
        } else {
          profitLossAmt = ItemBetList.isBack
            ? -ItemBetList.stack
            : -(
              (parseFloat(ItemBetList.odds.toString()) - 1) *
              parseFloat(ItemBetList.stack.toString())
            )
        }
        break
      case 'cmatch20':
      case 'joker20':
      case 'poison':
      case 'poison20':
      case 'lucky15':
      case 'race2':
      case 'cmeter1':
        let parts = resultsids.rdesc.split("#");
        const result = parts.some(part => ItemBetList.selectionName.includes(part));
        // const result = ItemBetList.selectionName.includes(winnerC);
        // const totalRuns = parseInt(ItemBetList.selectionId.toString()) + 1 + parseInt(selectionId)
        if (result) {
          profit_type = 'profit'
        } else if (!result) {
          profit_type = 'loss'
        }

        if (profit_type == 'profit') {
          profitLossAmt = ItemBetList.isBack
            ? (parseFloat(ItemBetList.odds.toString()) - 1) *
            parseFloat(ItemBetList.stack.toString())
            : ItemBetList.stack
        } else {
          profitLossAmt = ItemBetList.isBack
            ? -ItemBetList.stack
            : -(
              (parseFloat(ItemBetList.odds.toString()) - 1) *
              parseFloat(ItemBetList.stack.toString())
            )
        }
        break
      case 'worlimatka':
        const userCardsC1 = ItemBetList.C1
        const userCardsC3 = ItemBetList.C3
        const resultsData = data.resultsids
        if (resultsData[userCardsC3]) {
        }
        break

      case 'mogambo':
        if (resultsids) {
          let parts = resultsids.rdesc.split("#");
          let result = false;
          const winners = parts.map((part: any) => part.trim());
          if (ItemBetList.selectionName == 'Mogambo' && winners.includes('Mogambo')) {
            result = true
          } else if (ItemBetList.selectionName == 'Daga / Teja' && winners.includes('Daga/Teja')) {
            result = true
          } else if (ItemBetList.selectionName == '3 Card Total') {
            fancy = true;
            if (+winners[1] >= ItemBetList.Odds) {
              result = true
            }
          }
          profit_type =
            ItemBetList.isBack === true &&
              result
              ? 'profit'
              : ItemBetList.isBack === false &&
                !result
                ? 'profit'
                : 'loss'
                
         if (profit_type == 'profit') {
          if (fancy) {
            profitLossAmt = ItemBetList.isBack
              ? (parseFloat(ItemBetList.volume) * parseFloat(ItemBetList.stack)) / 100
              : ItemBetList.stack
          } else {
            profitLossAmt = ItemBetList.isBack
              ? (parseFloat(ItemBetList.odds.toString()) - 1) *
              parseFloat(ItemBetList.stack.toString())
              : ItemBetList.stack
          }
        } else {
          if (fancy) {
            profitLossAmt = ItemBetList.isBack
              ? -ItemBetList.stack
              : -(parseFloat(ItemBetList.volume) * parseFloat(ItemBetList.stack)) / 100
          } else {
            profitLossAmt = ItemBetList.isBack
              ? -ItemBetList.stack
              : -(
                (parseFloat(ItemBetList.odds.toString()) - 1) *
                parseFloat(ItemBetList.stack.toString())
              )
          }
        }
    }


    break

      case 'ballbyball':
if (resultsids) {
  let parts = resultsids.rdesc;
  let result = ItemBetList.selectionName.includes(parts);
  if ((ItemBetList.selectionName == 'Boundary') && (parts == '4 Run' || parts == '6 Run')) {
    result = true
  } else if ((ItemBetList.selectionName == 'Extra Runs') && (parts == 'Wide' || parts == 'No Ball' || parts == 'Noball')) {
    result = true
  } else if ((ItemBetList.selectionName == 'Wicket') && (parts == 'Run Out' || parts == 'Caught' || parts == 'Stump')) {
    result = true
  }
  // const result = ItemBetList.selectionName.includes(winnerC);
  // const totalRuns = parseInt(ItemBetList.selectionId.toString()) + 1 + parseInt(selectionId)
  if (result) {
    profit_type = 'profit'
  } else if (!result) {
    profit_type = 'loss'
  }

  if (profit_type == 'profit') {
    profitLossAmt = ItemBetList.isBack
      ? (parseFloat(ItemBetList.odds.toString()) - 1) *
      parseFloat(ItemBetList.stack.toString())
      : ItemBetList.stack
  } else {
    profitLossAmt = ItemBetList.isBack
      ? -ItemBetList.stack
      : -(
        (parseFloat(ItemBetList.odds.toString()) - 1) *
        parseFloat(ItemBetList.stack.toString())
      )
  }
}
break


    }

// console.log(profitLossAmt,'amount2')

return {
  profitLoss: profitLossAmt,
  profit_type,
}
  }

const profitLossCalculation = ({ ItemBetList, profit_type, profitLossAmt, fancy }: any) => {
  if (profit_type == 'profit') {
    if (fancy) {
      profitLossAmt = ItemBetList.isBack
        ? (parseFloat(ItemBetList.volume) * parseFloat(ItemBetList.stack)) / 100
        : ItemBetList.stack
    } else {
      profitLossAmt = ItemBetList.isBack
        ? (parseFloat(ItemBetList.odds.toString()) - 1) * parseFloat(ItemBetList.stack.toString())
        : ItemBetList.stack
    }
  } else if (profit_type == 'loss') {
    if (fancy) {
      profitLossAmt = ItemBetList.isBack
        ? -ItemBetList.stack
        : -(parseFloat(ItemBetList.volume) * parseFloat(ItemBetList.stack)) / 100
    } else {
      profitLossAmt = ItemBetList.isBack
        ? -ItemBetList.stack
        : -(
          (parseFloat(ItemBetList.odds.toString()) - 1) *
          parseFloat(ItemBetList.stack.toString())
        )
    }
  }
  return profitLossAmt
}





const addprofitlosstouser = async ({
  userId,
  bet_id,
  profit_loss,
  matchId,
  narration,
  sportsType,
  selectionId,
  sportId,
}: {
  userId: any
  bet_id: ObjectId
  profit_loss: number
  matchId: number
  narration: string
  sportsType: number
  selectionId: number
  sportId: number
}): Promise<void> => {
  userId = Types.ObjectId(userId);
  // console.log(userId,'step0')
  const user = await User.findOne({ _id: userId })
  // console.log(user, 'step1')
  const user_parent = await User.findOne({ _id: user?.parentId })
  // console.log(user_parent, 'step2')
  const parent_ratio =
    sportId == 5000
      ? user_parent?.partnership?.[4]?.allRatio
      : user_parent?.partnership?.[sportsType]?.allRatio
  const reference_id = await sendcreditdebit(
    userId,
    narration,
    profit_loss,
    matchId,
    bet_id,
    selectionId,
    sportId,
  )
  const updateplToBet = await Bet.updateOne(
    { _id: bet_id },
    { $set: { profitLoss: profit_loss } },
  )
  if (parent_ratio && parent_ratio.length > 0) {
    const accountforparent = parent_ratio.map(async (Item) => {
      let pl = (Math.abs(profit_loss) * Item.ratio) / 100
      const final_amount: number = profit_loss > 0 ? -pl : pl
      await sendcreditdebit(
        Item.parent,
        narration,
        final_amount,
        matchId,
        bet_id,
        selectionId,
        sportId,
      )
    })
    await Promise.all(accountforparent)
  }
}


const sendcreditdebit = async (
  userId: any,
  narration: string,
  profit_loss: number,
  matchId: number,
  betId: any,
  selectionId: number,
  sportId: number,
): Promise<any> => {
  const getAccStmt = await AccoutStatement.findOne({ userId: userId })
    .sort({ createdAt: -1 })
    .lean()
  const getOpenBal = getAccStmt?.closeBal ? getAccStmt.closeBal : 0

  const userAccountData: IAccoutStatement = {
    userId,
    narration: narration,
    amount: profit_loss,
    type: ChipsType.pnl,
    txnType: profit_loss > 0 ? TxnType.cr : TxnType.dr,
    openBal: getOpenBal,
    closeBal: getOpenBal + +profit_loss,
    matchId: matchId,
    betId: betId,
    selectionId,
    sportId,
  }

  const entryCheck = await AccoutStatement.findOne({
    txnType: profit_loss > 0 ? TxnType.cr : TxnType.dr,
    betId: betId,
    userId: userId,
  })
  if (!entryCheck) {
    const newUserAccStmt = new AccoutStatement(userAccountData)
    await newUserAccStmt.save()

    if (newUserAccStmt._id !== undefined && newUserAccStmt._id !== null) {
      return newUserAccStmt._id
    } else {
      return null
    }
  } else {
    return entryCheck._id
  }
}

};
