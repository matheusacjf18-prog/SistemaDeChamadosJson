import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login: setContextLogin } = useAuth();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: 'danger' });
    const [view, setView] = useState('login');
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const showMessage = (text, type = 'danger') => {
        setMessage({ text, type });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        
        const validUser = 'admin';
        const validPass = '123456';
        
        if (username === validUser && password === validPass) {
            const fakeSession = { 
                login: validUser, 
                groups: ['master_admin'],
                fullName: 'Administrador Local'
            };
        
            setContextLogin(fakeSession);
            navigate('/admin'); 
        } else {
            showMessage('Credenciais inválidas. Tente novamente.', 'danger');
        }
    };

    const handleForgot = (e) => {
        e.preventDefault();
        setLoading(true);
        showMessage('Verificando e-mail...', 'primary');
        
        setTimeout(() => {
            showMessage('');
            setView('verify');
            setLoading(false);
        }, 800);
    };

    const handleVerify = (e) => {
        e.preventDefault();
        setLoading(true);
        
        setTimeout(() => {
            if (recoveryCode === '123456') {
                setView('reset');
            } else {
                showMessage("Código incorreto. Use 123456 para testar.");
            }
            setLoading(false);
        }, 800);
    };

    const handleReset = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return showMessage("As senhas não coincidem!");
        setLoading(true);
        
        setTimeout(() => {
            alert("Senha atualizada com sucesso! Por favor, faça login.");
            setView('login');
            setUsername('');
            setPassword('');
            setLoading(false);
        }, 800);
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card p-4 shadow auth-card" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-4">
                    <img src="/assets/images/RMLogo.png" alt="RM Technologies" className="img-fluid logo-branding" />
                </div>
                
                {message.text && <p className={`text-${message.type} text-center small fw-bold mt-3`}>{message.text}</p>}

                {view === 'login' && (
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Usuário</label>
                            <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Senha</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>entrar</button>
                        <div className="text-center mt-3">
                            <a href="#" className="small text-decoration-none" onClick={(e) => { e.preventDefault(); setView('forgot'); showMessage(''); }}>Esqueci minha senha</a>
                        </div>
                    </form>
                )}

                {view === 'forgot' && (
                    <form onSubmit={handleForgot}>
                        <p className="small text-muted text-center">Informe seu e-mail para receber o código de recuperação.</p>
                        <div className="mb-3"><input type="email" className="form-control" placeholder="Seu e-mail" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} required /></div>
                        <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>Enviar Código</button>
                        <button type="button" className="btn btn-light border w-100" onClick={() => { setView('login'); showMessage(''); }}>Voltar</button>
                    </form>
                )}

                {view === 'verify' && (
                    <form onSubmit={handleVerify}>
                        <p className="small text-muted text-center">Digite o código de 6 dígitos enviado para o seu e-mail.</p>
                        <div className="mb-3"><input type="text" className="form-control text-center fs-4" maxLength="6" value={recoveryCode} onChange={e => setRecoveryCode(e.target.value)} required /></div>
                        <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>Validar Código</button>
                        <button type="button" className="btn btn-light border w-100" onClick={() => setView('login')}>Cancelar</button>
                    </form>
                )}

                {view === 'reset' && (
                    <form onSubmit={handleReset}>
                        <div className="mb-3"><input type="password" className="form-control" placeholder="Nova Senha" value={newPassword} onChange={e => setNewPassword(e.target.value)} required /></div>
                        <div className="mb-3"><input type="password" className="form-control" placeholder="Confirmar Senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></div>
                        <button type="submit" className="btn btn-success w-100 mb-2" disabled={loading}>Salvar Nova Senha</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;