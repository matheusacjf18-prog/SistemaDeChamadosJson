import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CadastroClientes = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });
    const [loading, setLoading] = useState(true);

    const apiUrl = 'http://localhost:5000/clientes';

    // 1. Requisão GET: Carregar dados ao montar o ecrã
    useEffect(() => {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setClientes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao procurar clientes:", err);
                setLoading(false);
            });
    }, []);

    // Atualiza os estados do formulário
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Requisição POST: Enviar novos dados
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const novoCliente = await response.json();
                // Atualiza a tabela na tela imediatamente
                setClientes([...clientes, novoCliente]);
                // Limpa os campos do formulário
                setFormData({ nome: '', email: '', telefone: '' });
                alert("Cliente cadastrado com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao cadastrar cliente.");
        }
    };

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Gestão de Clientes (Avaliação)</h2>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/admin')}>
                    Voltar ao Dashboard
                </button>
            </div>

            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Novo Cadastro</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nome Completo</label>
                                    <input type="text" className="form-control" name="nome" value={formData.nome} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">E-mail</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Telefone</label>
                                    <input type="tel" className="form-control" name="telefone" value={formData.telefone} onChange={handleChange} required />
                                </div>
                                <button type="submit" className="btn btn-success w-100 fw-bold">Salvar Cliente</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-dark text-white">
                            <h5 className="mb-0">Clientes Registados (JSON Server)</h5>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                            ) : clientes.length === 0 ? (
                                <p className="text-center text-muted p-4 mb-0">Nenhum cliente encontrado.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Nome</th>
                                                <th>E-mail</th>
                                                <th>Telefone</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clientes.map(cliente => (
                                                <tr key={cliente.id}>
                                                    <td>{cliente.id}</td>
                                                    <td className="fw-bold">{cliente.nome}</td>
                                                    <td>{cliente.email}</td>
                                                    <td>{cliente.telefone}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CadastroClientes;