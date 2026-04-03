import { Request, Response } from 'express'
import { BankAccount } from '../models/BankAccount'
import { IUserModel, User } from '../models/User'
import { ApiController } from './ApiController'
import { DepositWithdraw, IDepositWithdrawModel } from '../models/DepositWithdraw'
import { Types } from 'mongoose'
import { RoleType } from '../models/Role'
import { AccountController } from './AccountController'
import { Balance } from '../models/Balance'
import { Upi } from '../models/Upi'
import crypto from "crypto";
import axios from 'axios'
import { AccoutStatement, ChipsType, IAccoutStatement } from '../models/AccountStatement'
import { TxnType } from '../models/UserChip'

export class DepositWithdrawController extends ApiController {
  addBankAccount = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel

      const bank = await BankAccount.create({ userId: user._id, ...req.body })

      return this.success(res, { success: true, bank }, 'Bank account added successfully')
    } catch (e: any) {
      return this.fail(res, e)
    }
  }

  addUpi = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel

      const upi = await Upi.create({ userId: user._id, ...req.body })

      return this.success(res, { success: true, upi }, 'Upi account added successfully')
    } catch (e: any) {
      return this.fail(res, e)
    }
  }

  getBankAndUpiAccount = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel

      const upi = await Upi.find({ userId: user._id }).exec()
      const bank = await BankAccount.find({ userId: user._id }).exec()

      return this.success(res, { upi, bank })
    } catch (e: any) {
      return this.fail(res, e)
    }
  }

  deleteBankAndUpiAccount = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel

      if (req.body.type === 'upi')
        await Upi.deleteOne({ _id: req.body.id, userId: user._id }).exec()
      else await BankAccount.deleteOne({ _id: req.body.id, userId: user._id }).exec()

      return this.success(res, { success: true })
    } catch (e: any) {
      return this.fail(res, e)
    }
  }

  addDepositWithdraw = async (req: Request, res: Response): Promise<any> => {
    try {
      let user = req.user as IUserModel
      user = await User.findOne({ _id: Types.ObjectId(user?._id) })
      const filePath = req.file ? req.file.path : null
      const { type, utrno } = req.body
      const parentUsers = [...user.parentStr!]
      const checkWithdraw = await DepositWithdraw.findOne({ userId: user._id, status: 'pending', type: type })
      if (checkWithdraw) throw Error(`You have already created ${type} request!`)

      const getBalWithExp: any = await Balance.findOne({ userId: user._id })
      if (getBalWithExp.balance - getBalWithExp.exposer < req.body.amount && type == "withdraw") {
        throw Error('Insufficient amount to withdrawal, Due to pending exposure or less amount')
      }

      await DepositWithdraw.create({
        userId: user._id,
        parentId: parentUsers?.pop(),
        parentStr: user.parentStr,
        username: user.username,
        ...req.body,
        imageUrl: filePath,
        orderId: Date.now(),
        utrno: utrno
      })

      return this.success(
        res,
        { success: true },
        `${req.body.type === 'deposit' ? 'Deposit' : 'Withdraw'} amount added successfully`,
      )
    } catch (e: any) {
      return this.fail(res, e.message)
    }
  }

  md5_sign(data, key) {
    const sortedKeys = Object.keys(data).sort();
    const queryString = sortedKeys.map(k => `${k}=${data[k]}`).join('&');
    const stringToSign = `${queryString}&key=${key}`;
    const md5 = crypto.createHash('md5').update(stringToSign.trim(), 'utf8').digest('hex');
    return md5.toUpperCase(); // 🔥 IMPORTANT
  }

  getPaymentUrl = async (req: Request, res: Response): Promise<any> => {
    try {
      // 🔐 user fetch
      let user: any = req.user;
      user = await User.findById(user?._id);

      if (!user) {
        return res.status(401).json({
          status: false,
          message: "User not found"
        });
      }

      const { amount } = req.body || 500;

      if(amount < 120){
        return res.status(401).json({
          status:false,
          message:"Minium Recharge 500"
        })
      }

      // ✅ validation
      if (!amount || amount <= 0) {
        return res.status(400).json({
          status: false,
          message: "Valid amount is required"
        });
      }

      const orderId = Date.now();

      // 🔥 LG PAY CONFIG (HARDCODED)
      const url = "https://www.lg-pay.com/api/order/create";
      const key = "KPN2m1QR7mBmrfkhsrWzY26QuzemWXIp";
      const app_id = "YD4881";

      // const addon1 = `${user.username}#${user.phone}#${user.username}@gmail.com#0`;

      const params: any = {
        app_id,
        trade_type: "INRUPI",
        order_sn: orderId,
        money: amount * 100, // paise format
        notify_url: "https://kabook365.online",
        return_url: "https://kabook365.online/api/lg-pay",
        subject: "Deposit Order",
        // user_id: addon1,
        // ip: req.ip
      };

      // ===========================
      // 🔐 CREATE MD5 SIGN
      // ===========================
      const sortedKeys = Object.keys(params).sort();

      // const queryString =
      //   sortedKeys.map((k) => `${k}=${params[k]}`).join("&") +
      //   `&key=${key}`;

      const sign = this.md5_sign(params, key);

      const payload = { ...params, sign };

      // ===========================
      // 🚀 CALL LG PAY (AXIOS)
      // ===========================
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 10000
      });

      const lgres = response.data;

      console.log("LG PAY RESPONSE:", lgres);

      if (lgres.status !== 1) {
        return res.status(500).json({
          status: false,
          message: "Payment gateway failed"
        });
      }

      // ===========================
      // 💾 SAVE DB ENTRY
      // ===========================
      await DepositWithdraw.create({
        userId: user._id,
        username: user.username,
        type: "deposit",
        amount: amount,
        orderId: orderId,
        status: "pending"
      });

      // ===========================
      // ✅ RESPONSE
      // ===========================
      return res.status(200).json({
        status: true,
        paymentUrl: lgres?.data?.pay_url,
        orderId: orderId
      });

    } catch (error: any) {
      console.log("ERROR:", error?.response?.data || error.message);

      return res.status(500).json({
        status: false,
        message: error?.response?.data?.message || error.message
      });
    }
  };

  getDepositWithdraw = async (req: Request, res: Response): Promise<any> => {
    try {
      let { startDate, endDate, username, reportType } = req.body
      const user = req.user as IUserModel
      let query: any = {
        userId: Types.ObjectId(user._id),
        type: req.body.type,
      }
      if (user.role !== RoleType.user) {
        delete query.userId
        query.parentStr = { $elemMatch: { $eq: Types.ObjectId(user._id) } }
      }

      if (username) query.username = username

      if (startDate) {
        query.createdAt = {
          $gte: startDate.includes('T')
            ? `${startDate.replace('T', ' ')}:00`
            : `${startDate} 00:00:00`,
        }
      }
      if (endDate) {
        query.createdAt = {
          ...query.createdAt,
          $lte: endDate.includes('T') ? `${endDate.replace('T', ' ')}:00` : `${endDate} 23:59:59`,
        }
      }

      if (reportType && reportType != 'ALL') {
        query.status = reportType
      }
      console.log('query', query)
      const data = await DepositWithdraw.find(query).exec()

      return this.success(res, data)
    } catch (e: any) {
      return this.fail(res, e)
    }
  }

  updateDepositWithdraw = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.user as IUserModel
      const { id, status, ...rest } = req.body
      const txn: any = await DepositWithdraw.findOne({
        _id: Types.ObjectId(id),
        status: 'pending',
      })
      if (!txn) return this.fail(res, 'Entry not found')
      txn.remark = req.body.narration
      if (status === 'approved') {
        req.body.amount = txn.amount
        req.body.parentUserId = txn.parentId
        req.body.userId = txn.userId

        const { userAccBal, pnlData } = await new AccountController().depositWithdraw(
          req,
          req?.user as IUserModel,
        )
        const successMsg = 'Transaction Approved'

        if (successMsg) {
          txn.status = status
        }
        await txn.save()

        // If it's a withdrawal approval, update user fields
        if (txn.type === 'withdraw') {
          await User.updateOne(
            { _id: Types.ObjectId(txn.userId) },
            {
              $set: {
                extra: "yes",
                firstre: "completed",
                ekyc: "yes"
              }
            }
          );
        }

        return this.success(res, { success: true }, successMsg)
      } else {
        const successMsg = 'Transaction rejected'
        txn.status = 'rejected'
        await txn.save()

        return this.success(res, { success: true }, successMsg)
      }
      // await DepositWithdraw.findOneAndUpdate({ _id: id }, { ...rest })
    } catch (e: any) {
      return this.fail(res, e)
    }
  }


  callbackfrom = async (req: Request, res: Response): Promise<any> => {
    const {
      order_sn,
      money,
      status,
      pay_time,
      msg,
      remark,
      sign
    } = req.body;

    try {

      console.log(req.body,"callback from ")

      const Pendingreq = await DepositWithdraw.findOne({ orderId: order_sn })

      console.log(Pendingreq,"GHJ")
      if (!Pendingreq) {
        return res.send("fail")
      }


      const userId: any = Pendingreq["userId"]
      const amount: any = money
      let narration: "Payment By Gateway"


      const getOpenBal = await new AccountController().getUserBalance(userId)

      const userAccountData: IAccoutStatement = {
        userId,
        narration,
        amount,
        type: ChipsType.fc,
        txnType: TxnType.cr,
        openBal: getOpenBal,
        closeBal: getOpenBal + +amount,
        txnBy: `gateway`, //parent username here
      }

      const newUserAccStmt = new AccoutStatement(userAccountData)
      await newUserAccStmt.save()

      console.log("account statemetns save")


          if (newUserAccStmt._id !== undefined && newUserAccStmt._id !== null) {
            const pnlData = await new AccountController().calculatepnl(userId, 'd')
            const mbal = await new AccountController().getUserDepWithBalance(userId)
            await Balance.findOneAndUpdate(
              { userId },
              { balance: newUserAccStmt.closeBal, profitLoss: pnlData + +amount, mainBalance: mbal },
              { new: true, upsert: true },
            )
      
            // userAccBal = newUserAccStmt.closeBal
          }

      const currentuser = await User.findOne({ _id: Types.ObjectId(userId) });
      console.log(currentuser,"FGHJK")

      // First time deposit - set firstre to yes
      if (currentuser?.firstre === "no") {
        await User.updateOne(
          { _id: Types.ObjectId(userId) },
          {
            $set: {
              firstre: "yes"
            }
          }
        );
      }

      // If user has completed first recharge of 1499, set extra to yes
      if (currentuser?.firstre === "yes" && amount == 1499) {
        await User.updateOne(
          { _id: Types.ObjectId(userId) },
          {
            $set: {
              extra: "yes"
            }
          }
        );
      }

      // If user has ekyc yes and firstre completed, and deposits 699, reset ekyc for next cycle
      if (currentuser?.ekyc === "yes" && currentuser?.firstre === "completed" && amount == 699) {
        await User.updateOne(
          { _id: Types.ObjectId(userId) },
          {
            $set: {
              ekyc: "no",
              firstre: "yes",
              extra: "yes"
            }
          }
        );
      }
      res.send('ok')

    } catch (error) {
      res.send('fail')
    }
  }
}
