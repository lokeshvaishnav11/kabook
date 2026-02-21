import React from 'react'
import { useNavigateCustom } from '../_layout/elements/custom-link'
import SubmitButton from '../../components/SubmitButton'
import authService from '../../services/auth.service'
import axios from 'axios'


const RegisterNew = () => {
  const navigate = useNavigateCustom()

  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  })

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      setLoading(true)
    
      await axios.post(
        `${process.env.REACT_APP_API_BASEURL}register-new`,
        {
          username: formData.username,
          password: formData.password,
          parent: 'loom1234',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    
      alert('User Registered Successfully')
      navigate.go('/login')
    
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login'>
      <div className='loginInner1'>
        <div className='log-logo m-b-20 text-center'>
          <img src='/imgs/logo.png' className='logo-login' />
        </div>

        <div className='featured-box-login featured-box-secundary default'>
          <h4 className='text-center'>
            REGISTER <i className='fas fa-user-plus'></i>
          </h4>

          <form onSubmit={handleSubmit} autoComplete='off'>
            <div className='form-group m-b-20'>
              <input
                name='username'
                placeholder='User Name'
                type='text'
                className='form-control'
                onChange={handleChange}
                required
              />
              <i className='fas fa-user'></i>
            </div>

            <div className='form-group m-b-20'>
              <input
                name='password'
                placeholder='Password'
                type='password'
                className='form-control'
                onChange={handleChange}
                required
              />
              <i className='fas fa-key'></i>
              {error && <small className='text-danger'>{error}</small>}
            </div>

            <div className='form-group text-center mb-0'>
              <SubmitButton type='submit' className='btn btn-submit btn-login mb-10'>
                Register
                {loading ? (
                  <i className='ml-2 fas fa-spinner fa-spin'></i>
                ) : (
                  <i className='ml-2 fas fa-user-plus'></i>
                )}
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterNew