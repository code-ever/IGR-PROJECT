import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Layout from './layout/Layout'
import Dashboard from './pages/dasboard/Dashboard'
import MakePayment from './pages/payments/MakePayment'
import PaymentHistory from './pages/payments/PaymentHistory'
import Profile from './pages/dasboard/Profile'
import PaymentRecord from './pages/payments/PaymentRecord'
import Register from './pages/auth/Register'
import Vbr from './pages/payments/Vbr'
import Revenue from './pages/payments/Revenue'
import MembersRecords from './pages/dasboard/MembersRecords'
import Footer from './layout/Footer'
import TaxpayerDetails from './pages/taxpayers/TaxpayerDetails'
import TaxVerify from './pages/taxpayers/TaxVerify'
const App = () => {

  return (
    <div>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path='/' element={<Layout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='taxPayerDetail/:id' element={<TaxpayerDetails />} />
          <Route path='/payments/verify/:id' element={<TaxVerify />} />

          <Route path='vbr' element={<Vbr />} />
          <Route path='revtp' element={<Revenue />} />
          <Route path='membertrecords' element={<MembersRecords />} />
          <Route path='makepayment' element={<MakePayment />} />
          <Route path='history' element={<PaymentHistory />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile' element={<TaxpayerDetails />} />
          <Route path='paymentrecords' element={<PaymentRecord />} />
        </Route>
      </Routes>
      <Footer />
    </div>

  )
}

export default App
