import { Lock, Mail, User2Icon, LoaderIcon, AlertCircleIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const query = new URLSearchParams(window.location.search);
    const urlstate = query.get('state')
    const [state, setState] = React.useState(urlstate || "login")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')
    const navigate = useNavigate()

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    // API Configuration
    const API_BASE_URL = 'http://localhost:3000/api';

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        // Client-side validation
        if (state !== "login" && formData.name.trim().length < 2) {
            setError('Name must be at least 2 characters long')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            setLoading(false)
            return
        }

        try {
            const endpoint = state === "login" ? '/user/login' : '/user/register'
            const payload = state === "login" 
                ? { email: formData.email.trim(), password: formData.password }
                : { name: formData.name.trim(), email: formData.email.trim(), password: formData.password }

            console.log('Attempting to:', state, 'with payload:', payload)

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()
            console.log('Server response:', data)

            if (response.ok) {
                // Store the token in localStorage
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                
                // Show success message
                setSuccess(state === "login" ? "Login successful!" : "Account created successfully!")
                
                // Redirect to dashboard after a brief delay
                setTimeout(() => {
                    navigate('/app')
                }, 1000)
            } else {
                setError(data.message || 'Authentication failed')
            }
        } catch (error) {
            console.error('Auth error:', error)
            setError('Network error. Please check if the server is running.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
   
    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white shadow-lg">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? "Login" : "Sign up"}</h1>
                <p className="text-gray-500 text-sm mt-2">
                    {state === "login" ? "Please sign in to continue" : "Create your account to get started"}
                </p>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircleIcon size={16} />
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        {success}
                    </div>
                )}
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <User2Icon size={16} color='#6B7280'/>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Full Name" 
                            className="flex-1 border-none outline-none ring-0 pr-4" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            minLength={2}
                        />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                   <Mail size={16} color='#6B7280'/>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email address" 
                        className="flex-1 border-none outline-none ring-0 pr-4" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                   <Lock size={16} color='#6B7280'/>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        className="flex-1 border-none outline-none ring-0 pr-4" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        minLength={6}
                    />
                </div>
                <div className="mt-4 text-left text-indigo-500">
                    <button className="text-sm" type="reset">Forget password?</button>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="mt-2 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <LoaderIcon size={16} className="animate-spin" />
                            {state === "login" ? "Signing in..." : "Creating account..."}
                        </>
                    ) : (
                        state === "login" ? "Login" : "Sign up"
                    )}
                </button>
                <p className="text-gray-500 text-sm mt-3 mb-11">
                    {state === "login" ? "Don't have an account?" : "Already have an account?"} 
                    <button 
                        type="button"
                        onClick={() => {
                            setState(prev => prev === "login" ? "register" : "login")
                            setError('')
                            setFormData({ name: '', email: '', password: '' })
                        }}
                        className="text-indigo-500 hover:underline ml-1"
                    >
                        click here
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Login