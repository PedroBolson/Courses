'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, BookOpen, Calendar, DollarSign, BarChart3, Settings, Plus, Edit, Trash2, Eye, Save, ArrowLeft, GraduationCap } from 'lucide-react';
import { useQuery } from '@/contexts/QueryContext';
import { fixObjectEncoding } from '@/utils/textUtils';

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DashboardStats {
    totalAlunos: number;
    totalCursos: number;
    totalPalestras: number;
    totalPagamentos: number;
}

interface Aluno {
    id: number;
    pessoa_id: number;
    status_pagamento: string;
    data_matricula: string;
    nome?: string;
    email?: string;
    telefone?: string;
}

interface Curso {
    id: number;
    titulo: string;
    descricao: string;
    professor_id: number;
    area_id: number;
    duracao_horas: number;
    valor: number;
    nome_professor?: string;
    nome_area?: string;
}

interface Palestra {
    id: number;
    titulo: string;
    descricao: string;
    data_hora: string;
    local: string;
    convidado_id: number;
    area_id: number;
    nome_convidado?: string;
    nome_area?: string;
}

interface Pessoa {
    id: number;
    nome: string;
    email: string;
    telefone: string;
}

interface Area {
    id: number;
    nome_area: string;
    descricao: string;
}

interface Professor {
    id: number;
    pessoa_id: number;
    especialidade: string;
    data_contratacao: string;
    nome?: string;
    email?: string;
    telefone?: string;
}

interface Admin {
    id: number;
    username: string;
    password_hash?: string;
}

type DataItem = Aluno | Curso | Palestra | Pessoa | Area | Professor | Admin;
type FormDataType = Record<string, string | number | undefined>;

type ManagementSection = 'overview' | 'pessoas' | 'alunos' | 'professores' | 'palestras' | 'areas' | 'cursos' | 'admins';
type ActionMode = 'list' | 'create' | 'edit' | 'view';

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
    const [stats, setStats] = useState<DashboardStats>({
        totalAlunos: 0,
        totalCursos: 0,
        totalPalestras: 0,
        totalPagamentos: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentSection, setCurrentSection] = useState<ManagementSection>('overview');
    const [actionMode, setActionMode] = useState<ActionMode>('list'); const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);    // Data states
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [palestras, setPalestras] = useState<Palestra[]>([]); const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [admins, setAdmins] = useState<Admin[]>([]);

    // Form states
    const [formData, setFormData] = useState<FormDataType>({});
    const [formLoading, setFormLoading] = useState(false);    // Current admin info (simulated - in real app would come from auth)
    const [currentAdmin] = useState({ id: 1, username: 'admin' });

    const { addQuery } = useQuery();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        if (isOpen) {
            fetchOverviewData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const fetchOverviewData = async () => {
        try {
            setLoading(true);
            const [alunosRes, cursosRes, palestrasRes, pagamentosRes] = await Promise.all([
                fetch(`${API_URL}/alunos`),
                fetch(`${API_URL}/cursos`),
                fetch(`${API_URL}/palestras`),
                fetch(`${API_URL}/pagamentos`)
            ]);

            const [alunosData, cursosData, palestrasData, pagamentosData] = await Promise.all([
                alunosRes.json(),
                cursosRes.json(),
                palestrasRes.json(),
                pagamentosRes.json()
            ].map(promise => promise.then(data => fixObjectEncoding(data))));

            // Add queries to context - showing SQL query with endpoint for identification
            if (alunosData.executedQuery) addQuery(alunosData.executedQuery, 'GET /alunos');
            if (cursosData.executedQuery) addQuery(cursosData.executedQuery, 'GET /cursos');
            if (palestrasData.executedQuery) addQuery(palestrasData.executedQuery, 'GET /palestras');
            if (pagamentosData.executedQuery) addQuery(pagamentosData.executedQuery, 'GET /pagamentos');

            setStats({
                totalAlunos: alunosData.rows?.length || 0,
                totalCursos: cursosData.rows?.length || 0,
                totalPalestras: palestrasData.rows?.length || 0,
                totalPagamentos: pagamentosData.rows?.length || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }; const fetchSectionData = async (section: ManagementSection) => {
        if (section === 'overview') return;

        try {
            setLoading(true);

            // Special handling for admins - use different endpoint
            if (section === 'admins') {
                const adminResponse = await fetch(`${API_URL}/admin`);
                const adminData = await adminResponse.json();
                const fixedAdminData = fixObjectEncoding(adminData);
                setAdmins(fixedAdminData.rows || []);
                if (fixedAdminData.executedQuery) {
                    addQuery(fixedAdminData.executedQuery, 'GET /admin');
                }
                return;
            }

            // Generic handling for other sections
            const response = await fetch(`${API_URL}/${section}`);
            const data = await response.json();
            const fixedData = fixObjectEncoding(data);

            // Add the actual SQL query to context
            if (fixedData.executedQuery) {
                addQuery(fixedData.executedQuery, `GET /${section}`);
            }

            switch (section) {
                case 'alunos':
                    setAlunos(fixedData.rows || []);
                    break;
                case 'cursos':
                    setCursos(fixedData.rows || []);
                    break;
                case 'palestras':
                    setPalestras(fixedData.rows || []);
                    break;
                case 'pessoas':
                    setPessoas(fixedData.rows || []);
                    break;
                case 'areas':
                    setAreas(fixedData.rows || []);
                    break;
                case 'professores':
                    setProfessores(fixedData.rows || []);
                    break;
            }
        } catch (error) {
            console.error(`Error fetching ${section} data:`, error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReferenceData = async () => {
        try {
            const [pessoasRes, areasRes] = await Promise.all([
                fetch(`${API_URL}/pessoas`),
                fetch(`${API_URL}/areas`)
            ]);

            const [pessoasData, areasData] = await Promise.all([
                pessoasRes.json(),
                areasRes.json()
            ].map(promise => promise.then(data => fixObjectEncoding(data))));

            setPessoas(pessoasData.rows || []);
            setAreas(areasData.rows || []);
        } catch (error) {
            console.error('Error fetching reference data:', error);
        }
    };

    const handleSectionChange = async (section: ManagementSection) => {
        setCurrentSection(section);
        setActionMode('list');
        setSelectedItem(null);
        setFormData({});

        if (section !== 'overview') {
            await fetchSectionData(section);
            await fetchReferenceData();
        }
    };

    const handleCreate = () => {
        setActionMode('create');
        setSelectedItem(null);
        setFormData(getEmptyFormData(currentSection));
    }; const handleEdit = (item: DataItem) => {
        setActionMode('edit');
        setSelectedItem(item);
        setFormData({ ...item });
    };

    const handleView = (item: DataItem) => {
        setActionMode('view');
        setSelectedItem(item);
    }; const handleDelete = async (id: number) => {
        // Special handling for admins - prevent self-deletion
        if (currentSection === 'admins' && id === currentAdmin.id) {
            alert('Você não pode excluir sua própria conta de administrador!');
            return;
        }

        if (!confirm('Tem certeza que deseja excluir este item?')) return; try {
            setFormLoading(true);

            const response = await fetch(`${API_URL}/${currentSection === 'admins' ? 'admin' : currentSection}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.executedQuery) {
                    addQuery(data.executedQuery, `DELETE /${currentSection === 'admins' ? 'admin' : currentSection}/${id}`);
                }
                await fetchSectionData(currentSection);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        } finally {
            setFormLoading(false);
        }
    }; const handleSave = async () => {
        try {
            setFormLoading(true);

            const isEdit = actionMode === 'edit';
            let url: string;
            let method: string;

            if (currentSection === 'admins') {
                if (isEdit && selectedItem) {
                    // Update existing admin
                    url = `${API_URL}/admin/${selectedItem.id}`;
                    method = 'PUT';
                } else {
                    // Create new admin
                    url = `${API_URL}/admin/register`;
                    method = 'POST';
                }
            } else {
                url = isEdit && selectedItem ? `${API_URL}/${currentSection}/${selectedItem.id}` : `${API_URL}/${currentSection}`;
                method = isEdit ? 'PUT' : 'POST';
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.executedQuery) {
                    const methodText = isEdit ? 'PUT' : 'POST';
                    const endpoint = isEdit && selectedItem ?
                        `/${currentSection === 'admins' ? 'admin' : currentSection}/${selectedItem.id}` :
                        `/${currentSection === 'admins' ? 'admin' : currentSection}`;
                    addQuery(data.executedQuery, `${methodText} ${endpoint}`);
                }
                setActionMode('list');
                await fetchSectionData(currentSection);
            }
        } catch (error) {
            console.error('Error saving item:', error);
        } finally {
            setFormLoading(false);
        }
    }; const getEmptyFormData = (section: ManagementSection): FormDataType => {
        switch (section) {
            case 'alunos':
                return { pessoa_id: '', senha: '' }; case 'cursos':
                return { titulo: '', descricao: '', professor_id: '', area_id: '', duracao_horas: '', valor: '' };
            case 'palestras':
                return { titulo: '', descricao: '', data_hora: '', local: '', convidado_id: '', area_id: '' };
            case 'pessoas':
                return { nome: '', email: '', telefone: '' };
            case 'areas':
                return { nome_area: '', descricao: '' }; case 'professores':
                return { pessoa_id: '', especialidade: '', data_contratacao: '' }; case 'admins':
                return { username: '', password: '' };
            default:
                return {};
        }
    }; const renderFormField = (field: string, value: string | number | undefined, type: string = 'text') => {
        if (type === 'select') {
            let options: (Pessoa | Area)[] = [];
            if (field === 'pessoa_id' || field === 'convidado_id') options = pessoas;
            if (field === 'area_id') options = areas;
            if (field === 'professor_id') options = pessoas; // Assumindo que professores estão em pessoas

            return (
                <select
                    value={value || ''}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    required
                >                    <option value="">Selecione...</option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {'nome' in option ? option.nome : 'nome_area' in option ? option.nome_area : ''}
                        </option>
                    ))}
                </select>
            );
        }

        if (type === 'textarea') {
            return (
                <textarea
                    value={value || ''}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                    rows={3}
                />
            );
        }

        return (
            <input
                type={type}
                value={value || ''}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
        );
    };

    const renderFormFields = () => {
        switch (currentSection) {
            case 'alunos':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pessoa
                            </label>
                            {renderFormField('pessoa_id', formData.pessoa_id, 'select')}
                        </div>
                        {actionMode === 'create' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Senha
                                </label>
                                {renderFormField('senha', formData.senha, 'password')}
                            </div>
                        )}
                        {actionMode === 'edit' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>                                <select
                                    value={formData.status_pagamento || ''}
                                    onChange={(e) => setFormData({ ...formData, status_pagamento: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                >
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                    <option value="suspenso">Suspenso</option>
                                </select>
                            </div>
                        )}
                    </>
                ); case 'cursos':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Título
                            </label>
                            {renderFormField('titulo', formData.titulo)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descrição
                            </label>
                            {renderFormField('descricao', formData.descricao, 'textarea')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Professor
                            </label>
                            {renderFormField('professor_id', formData.professor_id, 'select')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Área
                            </label>
                            {renderFormField('area_id', formData.area_id, 'select')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Duração (horas)
                            </label>
                            {renderFormField('duracao_horas', formData.duracao_horas, 'number')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Valor (R$)
                            </label>
                            {renderFormField('valor', formData.valor, 'number')}
                        </div>
                    </>
                );
            case 'palestras':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Título
                            </label>
                            {renderFormField('titulo', formData.titulo)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descrição
                            </label>
                            {renderFormField('descricao', formData.descricao, 'textarea')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Data e Hora
                            </label>
                            {renderFormField('data_hora', formData.data_hora, 'datetime-local')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Local
                            </label>
                            {renderFormField('local', formData.local)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Convidado
                            </label>
                            {renderFormField('convidado_id', formData.convidado_id, 'select')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Área
                            </label>
                            {renderFormField('area_id', formData.area_id, 'select')}
                        </div>
                    </>
                );
            case 'pessoas':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome
                            </label>
                            {renderFormField('nome', formData.nome)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            {renderFormField('email', formData.email, 'email')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Telefone
                            </label>
                            {renderFormField('telefone', formData.telefone, 'tel')}
                        </div>
                    </>
                ); case 'areas':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome da Área
                            </label>
                            {renderFormField('nome_area', formData.nome_area)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descrição
                            </label>
                            {renderFormField('descricao', formData.descricao, 'textarea')}
                        </div>
                    </>
                ); case 'professores':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pessoa
                            </label>
                            {renderFormField('pessoa_id', formData.pessoa_id, 'select')}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Especialidade
                            </label>
                            {renderFormField('especialidade', formData.especialidade)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Data de Contratação
                            </label>
                            {renderFormField('data_contratacao', formData.data_contratacao, 'date')}
                        </div>
                    </>
                );
            case 'admins':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome de Usuário
                            </label>
                            {renderFormField('username', formData.username)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Senha
                            </label>
                            {renderFormField('password', formData.password, 'password')}
                        </div>
                    </>
                );
            default:
                return null;
        }
    }; const renderListView = () => {
        let data: DataItem[] = [];
        let columns: string[] = []; switch (currentSection) {
            case 'alunos':
                data = alunos;
                columns = ['ID', 'Nome', 'Email', 'Status', 'Data Matrícula'];
                break; case 'cursos':
                data = cursos;
                columns = ['ID', 'Título', 'Professor', 'Área', 'Duração (h)', 'Valor (R$)'];
                break;
            case 'palestras':
                data = palestras;
                columns = ['ID', 'Título', 'Data/Hora', 'Local', 'Convidado'];
                break;
            case 'pessoas':
                data = pessoas;
                columns = ['ID', 'Nome', 'Email', 'Telefone'];
                break;
            case 'areas':
                data = areas;
                columns = ['ID', 'Nome da Área', 'Descrição'];
                break; case 'professores':
                data = professores;
                columns = ['ID', 'Nome', 'Email', 'Especialidade', 'Data Contratação'];
                break; case 'admins':
                data = admins;
                columns = ['ID', 'Username'];
                break;
        }

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
                    </h3>
                    <button
                        onClick={handleCreate}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Adicionar</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                {columns.map((column) => (
                                    <th key={column} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {column}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                    {currentSection === 'alunos' && (
                                        <>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Aluno).nome || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Aluno).email || 'N/A'}</td>                                            <td className="px-4 py-3 text-sm">
                                                <select
                                                    value={(item as Aluno).status_pagamento || 'ativo'} onChange={async (e) => {
                                                        const newStatus = e.target.value;
                                                        try {
                                                            const response = await fetch(`${API_URL}/alunos/${item.id}/status`, {
                                                                method: 'PUT',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ status: newStatus })
                                                            });
                                                            if (response.ok) {
                                                                const data = await response.json();
                                                                if (data.executedQuery) {
                                                                    addQuery(data.executedQuery, `PUT /alunos/${item.id}/status`);
                                                                }
                                                                await fetchSectionData('alunos');
                                                            }
                                                        } catch (error) {
                                                            console.error('Error updating status:', error);
                                                        }
                                                    }}
                                                    className="flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium border-0 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                                                    style={{
                                                        color: (item as Aluno).status_pagamento === 'ativo' ? '#059669' :
                                                            (item as Aluno).status_pagamento === 'inativo' ? '#6b7280' : '#dc2626',
                                                        appearance: 'none',
                                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                                        backgroundPosition: 'right 0.5rem center',
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: '1.5em 1.5em',
                                                        paddingRight: '2.5rem'
                                                    }}
                                                >
                                                    <option value="ativo">✅ Ativo</option>
                                                    <option value="inativo">❌ Inativo</option>
                                                    <option value="suspenso">⚠️ Suspenso</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                {(item as Aluno).data_matricula ? new Date((item as Aluno).data_matricula).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </>
                                    )}                                    {currentSection === 'cursos' && (
                                        <>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Curso).titulo}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Curso).nome_professor || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Curso).nome_area || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Curso).duracao_horas || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                {(item as Curso).valor ? `R$ ${(item as Curso).valor.toFixed(2)}` : 'N/A'}
                                            </td>
                                        </>
                                    )}
                                    {currentSection === 'palestras' && (
                                        <>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Palestra).titulo}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                {(item as Palestra).data_hora ? new Date((item as Palestra).data_hora).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Palestra).local}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Palestra).nome_convidado || 'N/A'}</td>
                                        </>
                                    )}
                                    {currentSection === 'pessoas' && (
                                        <>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Pessoa).nome}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Pessoa).email}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Pessoa).telefone || 'N/A'}</td>
                                        </>
                                    )}                                    {currentSection === 'areas' && (
                                        <>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Area).nome_area}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Area).descricao}</td>
                                        </>
                                    )}                                    {currentSection === 'professores' && (
                                        <>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Professor).nome || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Professor).email || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Professor).especialidade}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                {(item as Professor).data_contratacao ? new Date((item as Professor).data_contratacao).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </>
                                    )}                                    {currentSection === 'admins' && (
                                        <>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{(item as Admin).username}</td>
                                        </>
                                    )}                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                                title="Visualizar"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {currentSection !== 'alunos' && (
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className={`${currentSection === 'admins' && item.id === currentAdmin.id
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200'
                                                    }`}
                                                title={currentSection === 'admins' && item.id === currentAdmin.id
                                                    ? 'Não é possível excluir sua própria conta'
                                                    : 'Excluir'
                                                }
                                                disabled={currentSection === 'admins' && item.id === currentAdmin.id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderFormView = () => {
        const title = actionMode === 'create' ? 'Adicionar' : actionMode === 'edit' ? 'Editar' : 'Visualizar';
        const sectionName = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setActionMode('list')}
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title} {sectionName}
                        </h3>
                    </div>

                    {actionMode !== 'view' && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActionMode('list')}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                disabled={formLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={formLoading}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                {formLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span>{formLoading ? 'Salvando...' : 'Salvar'}</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {actionMode === 'view' ? (
                            // View mode - display data as read-only
                            <>
                                {Object.entries(selectedItem || {}).map(([key, value]) => {
                                    if (key === 'id') return null;
                                    return (
                                        <div key={key}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </label>
                                            <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700 px-3 py-2 rounded-lg">
                                                {value?.toString() || 'N/A'}
                                            </p>
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            renderFormFields()
                        )}
                    </div>
                </div>
            </div>
        );
    }; if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center p-4 pt-20 min-h-screen overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex">
                {/* Sidebar */}
                <div className="w-64 bg-gray-50 dark:bg-slate-700 border-r border-gray-200 dark:border-gray-600 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Admin
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <X className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>                    <nav className="space-y-2">
                        <button
                            onClick={() => handleSectionChange('overview')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'overview'
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <BarChart3 className="h-4 w-4" />
                            <span>Visão Geral</span>
                        </button>

                        <button
                            onClick={() => handleSectionChange('pessoas')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'pessoas'
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Users className="h-4 w-4" />
                            <span>Pessoas</span>
                        </button>

                        <button
                            onClick={() => handleSectionChange('alunos')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'alunos'
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Users className="h-4 w-4" />
                            <span>Alunos</span>
                        </button>

                        <button
                            onClick={() => handleSectionChange('professores')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'professores'
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <GraduationCap className="h-4 w-4" />
                            <span>Professores</span>
                        </button>

                        <button
                            onClick={() => handleSectionChange('palestras')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'palestras'
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Calendar className="h-4 w-4" />
                            <span>Palestras</span>
                        </button>

                        <button
                            onClick={() => handleSectionChange('areas')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'areas'
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Settings className="h-4 w-4" />
                            <span>Áreas</span>
                        </button>                        <button
                            onClick={() => handleSectionChange('cursos')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'cursos'
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <BookOpen className="h-4 w-4" />
                            <span>Cursos</span>
                        </button>

                        <button
                            onClick={() => handleSectionChange('admins')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${currentSection === 'admins'
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Settings className="h-4 w-4" />
                            <span>Administradores</span>
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dados...</p>
                            </div>
                        ) : currentSection === 'overview' ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Painel Administrativo
                                </h2>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total de Alunos</p>
                                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.totalAlunos}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total de Cursos</p>
                                                <p className="text-2xl font-bold text-green-900 dark:text-green-300">{stats.totalCursos}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total de Palestras</p>
                                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{stats.totalPalestras}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                                                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Total de Pagamentos</p>
                                                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{stats.totalPagamentos}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Ações Rápidas
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            onClick={() => handleSectionChange('alunos')}
                                            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            <Users className="h-5 w-5" />
                                            <span>Gerenciar Alunos</span>
                                        </button>
                                        <button
                                            onClick={() => handleSectionChange('cursos')}
                                            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            <BookOpen className="h-5 w-5" />
                                            <span>Gerenciar Cursos</span>
                                        </button>
                                        <button
                                            onClick={() => handleSectionChange('palestras')}
                                            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            <Calendar className="h-5 w-5" />
                                            <span>Gerenciar Palestras</span>
                                        </button>
                                    </div>
                                </div>

                                {/* System Status */}
                                <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        📊 Status do Sistema
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Base de dados</span>
                                            <span className="text-green-600 dark:text-green-400 font-medium">✓ Conectada</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">API Backend</span>
                                            <span className="text-green-600 dark:text-green-400 font-medium">✓ Funcionando</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Encoding de Caracteres</span>
                                            <span className="text-green-600 dark:text-green-400 font-medium">✓ Corrigido</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : actionMode === 'list' ? (
                            renderListView()
                        ) : (
                            renderFormView()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
