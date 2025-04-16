import AuthForm from '../components/AuthForm'

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Dominion City Church Admin</h1>
        <AuthForm />
      </div>
    </div>
  )
}

export default Login 