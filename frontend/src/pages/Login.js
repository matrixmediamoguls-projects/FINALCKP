import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeSlash, Fingerprint } from '@phosphor-icons/react';
import SocialAuthButtons from '../components/SocialAuthButtons';

const HERO_IMAGE =
'https://firebasestorage.googleapis.com/v0/b/banani-prod.appspot.com/o/reference-images%2F472bbff8-144d-45e0-b298-42659f149878?alt=media&token=0149655e-82d8-4a6a-a53f-a4f395656542';

const baseInputClass =
'h-12 w-full border px-4 text-sm tracking-[0.02em] outline-none transition-all duration-200 rounded-none';

const emptyInputClass =
'border-chroma-border-default bg-[#121214] text-chroma-text-primary placeholder:text-chroma-text-muted focus:border-chroma-gold focus:shadow-[0_0_0_1px_rgba(205,164,52,0.3)]';

const filledInputClass =
'border-transparent bg-[#e8f0fe] text-[#111827] placeholder:text-[#6b7280] focus:border-chroma-gold';

const monoFooterClass = 'font-mono text-[11px] uppercase tracking-[0.32em] text-chroma-text-muted';

const Login = () => {
const [protocolHandle, setProtocolHandle] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState('');

const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();
setError('');

```
try {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: protocolHandle,
      password: password
    })
  });

  const data = await res.json();

  console.log("BACKEND RESPONSE:", data);

  if (res.ok) {
    localStorage.setItem("token", data.token);
    console.log("NAVIGATING NOW");
    navigate('/dashboard');
  } else {
    setError(data.detail || "Login failed");
  }

} catch (err) {
  console.error("ERROR:", err);
  setError("Server error. Check backend.");
}
```

};

return ( <div className="min-h-screen bg-[#050505] text-chroma-text-primary"> <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px] xl:grid-cols-[minmax(0,1fr)_540px]">

```
    <motion.div
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative hidden overflow-hidden lg:block"
    >
      <img
        src={HERO_IMAGE}
        alt="Protocol Background"
        className="h-full w-full object-cover opacity-85"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,0)_48%,rgba(3,3,3,0.72)_77%,#030303_100%)]" />
    </motion.div>

    <div className="flex flex-col bg-[#030303]">
      <div className="flex flex-1 justify-center px-6 py-12 sm:px-10 lg:px-12">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative z-10 flex w-full max-w-[360px] flex-col gap-7"
        >
          
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-chroma-gold">
              <Fingerprint size={24} className="text-chroma-gold" weight="thin" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-[2rem] font-bold uppercase text-white">
                Chroma Key
              </h1>
              <p className="font-mono text-[13px] text-chroma-text-secondary">
                Protocol Access
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {error && (
              <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Field
              label="Protocol Handle"
              id="login-handle"
              placeholder="Enter your handle"
              value={protocolHandle}
              onChange={setProtocolHandle}
              filled={Boolean(protocolHandle)}
              required
            />

            <PasswordField
              label="Password"
              id="login-password"
              placeholder="Enter password"
              value={password}
              onChange={setPassword}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((p) => !p)}
              filled={Boolean(password)}
              required
            />

            <button
              type="submit"
              className="mt-2 flex h-12 w-full items-center justify-center bg-[#7ab829] text-sm font-bold uppercase text-black hover:bg-[#8dd338]"
            >
              Access Protocol
            </button>

          </form>

          <p className="text-center text-sm text-chroma-text-secondary">
            New to the Protocol?{' '}
            <Link to="/register" className="text-chroma-gold hover:text-[#f0cc40]">
              Initialize Access
            </Link>
          </p>

        </motion.div>
      </div>

      <div className={`px-6 pb-8 pt-4 text-center ${monoFooterClass}`}>
        The Chroma Key Protocol // Musiq Matrix
      </div>
    </div>
  </div>
</div>
```

);
};

const Field = ({ id, label, placeholder, value, onChange, filled, required }) => ( <label className="flex flex-col gap-2"> <span className="text-sm text-white">{label}</span>
<input
id={id}
value={value}
onChange={(e) => onChange(e.target.value)}
placeholder={placeholder}
required={required}
className={`${baseInputClass} ${filled ? filledInputClass : emptyInputClass}`}
/> </label>
);

const PasswordField = ({
id,
label,
placeholder,
value,
onChange,
showPassword,
onTogglePassword,
filled,
required
}) => ( <label className="flex flex-col gap-2"> <span className="text-sm text-white">{label}</span> <div className="relative">
<input
id={id}
type={showPassword ? 'text' : 'password'}
value={value}
onChange={(e) => onChange(e.target.value)}
placeholder={placeholder}
required={required}
className={`${baseInputClass} pr-12 ${filled ? filledInputClass : emptyInputClass}`}
/> <button
     type="button"
     onClick={onTogglePassword}
     className="absolute right-4 top-1/2 -translate-y-1/2"
   >
{showPassword ? <EyeSlash size={18} /> : <Eye size={18} />} </button> </div> </label>
);

export default Login;
