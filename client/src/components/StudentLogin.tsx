'use client';

import React, { useState } from 'react';
import { X, User, Lock, GraduationCap, BookOpen, Calendar, Award, Clock, DollarSign, Star } from 'lucide-react';
import CourseSelector from './CourseSelector';
import EnrollmentFlow from './EnrollmentFlow';
import FeedbackModal from './FeedbackModal';
import { fixObjectEncoding } from '../utils/textUtils';
import { useQuery } from '../contexts/QueryContext';

interface StudentLoginProps {
    isOpen: boolean;
    onClose: () => void;
}

interface StudentData {
    id: number;
    pessoa_id: number;
    nome: string;
    email: string;
    telefone: string;
    status_pagamento: string;
}

interface StudentCourse {
    id: number;
    alunosCursosId?: number; // ID da relação aluno-curso para feedback
    titulo: string;
    descricao: string;
    duracao_horas: number;
    valor: number;
    professor_nome: string;
    nome_area: string;
    data_inscricao: string;
}

interface StudentCourseFromView {
    AlunoID: number;
    NomeAluno: string;
    CursoID: number;
    TituloCurso: string;
    DataInscricao: string;
    StatusPagamento: string;
}

interface DetailedCourse {
    id: number;
    titulo: string;
    descricao: string;
    duracao_horas: number;
    valor: number;
    nome_professor: string;
    nome_area: string;
}

export default function StudentLogin({ isOpen, onClose }: StudentLoginProps) {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPortal, setShowPortal] = useState(false);
    const [loginError, setLoginError] = useState(''); const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]); const [courseSelectorOpen, setCourseSelectorOpen] = useState(false);
    const [enrollmentFlow, setEnrollmentFlow] = useState<{
        isOpen: boolean;
        courseName: string;
        coursePrice: number;
        courseId: number;
    }>({
        isOpen: false,
        courseName: '',
        coursePrice: 299.90,
        courseId: 1
    });
    const [feedbackModal, setFeedbackModal] = useState<{
        isOpen: boolean;
        alunosCursosId: number;
        courseTitle: string;
    }>({
        isOpen: false,
        alunosCursosId: 0,
        courseTitle: ''
    });

    const { addQuery } = useQuery();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Bloquear scroll do body quando modal estiver aberto
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup quando o componente desmontar
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLoginError(''); try {
            // Login do aluno
            const loginResponse = await fetch(`${API_URL}/alunos/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            }); const loginData = await loginResponse.json();

            if (!loginData.success) {
                setLoginError(loginData.message);
                setLoading(false);
                return;
            }

            // Aplicar correção de encoding nos dados do aluno
            const loginDataFixed = fixObjectEncoding(loginData);
            console.log('Dados do aluno com encoding corrigido:', loginDataFixed.aluno);

            // Add the login query to context if available
            if (loginData.executedQuery) {
                addQuery(loginData.executedQuery, 'POST /alunos/login');
            }

            // Buscar cursos do aluno usando a view
            const cursosResponse = await fetch(`${API_URL}/vw/alunos-cursos-pagamentos/${loginDataFixed.aluno.id}`);
            const cursosData = await cursosResponse.json();

            console.log('Dados do aluno logado:', loginDataFixed.aluno);
            console.log('Cursos encontrados via view:', cursosData);

            // Add view query to context if available
            if (cursosData.executedQuery) {
                addQuery(cursosData.executedQuery, `GET /vw/alunos-cursos-pagamentos/${loginDataFixed.aluno.id}`);
            }

            // Aplicar correção de encoding nos dados da view
            const cursosDataFixed = fixObjectEncoding(cursosData);
            console.log('Cursos com encoding corrigido:', cursosDataFixed);

            // Transformar os dados da view para o formato esperado e buscar detalhes dos cursos
            const cursosFormatados: StudentCourse[] = []; if (cursosDataFixed.rows && cursosDataFixed.rows.length > 0) {
                for (const item of cursosDataFixed.rows) {
                    const viewCourse = item as StudentCourseFromView;

                    // Se o curso existe (não é null), buscar detalhes completos
                    if (viewCourse.CursoID) {
                        try {
                            const cursoDetailResponse = await fetch(`${API_URL}/cursos/${viewCourse.CursoID}`);
                            const cursoDetailData = await cursoDetailResponse.json();
                            if (cursoDetailData.executedQuery) addQuery(cursoDetailData.executedQuery, `GET /cursos/${viewCourse.CursoID}`);

                            if (cursoDetailData.rows && cursoDetailData.rows[0]) {
                                const detailedCourse = cursoDetailData.rows[0] as DetailedCourse;

                                // Aplicar correção de encoding nos detalhes do curso
                                const detailedCourseFixed = fixObjectEncoding(detailedCourse);                                // Buscar o alunosCursosId da relação usando rota simples
                                const relationResponse = await fetch(`${API_URL}/alunos-cursos/relation/${loginDataFixed.aluno.id}/${viewCourse.CursoID}`);
                                const relationData = await relationResponse.json();
                                if (relationData.executedQuery) addQuery(relationData.executedQuery, `GET /alunos-cursos/relation/${loginDataFixed.aluno.id}/${viewCourse.CursoID}`);

                                let alunosCursosId: number | undefined = undefined;
                                if (relationData.rows && relationData.rows[0]) {
                                    alunosCursosId = relationData.rows[0].id;
                                }

                                cursosFormatados.push({
                                    id: detailedCourseFixed.id,
                                    alunosCursosId: alunosCursosId, // ID da relação para feedback
                                    titulo: detailedCourseFixed.titulo,
                                    descricao: detailedCourseFixed.descricao,
                                    duracao_horas: detailedCourseFixed.duracao_horas,
                                    valor: detailedCourseFixed.valor,
                                    professor_nome: detailedCourseFixed.nome_professor,
                                    nome_area: detailedCourseFixed.nome_area,
                                    data_inscricao: viewCourse.DataInscricao
                                });
                            }
                        } catch (error) {
                            console.error(`Erro ao buscar detalhes do curso ${viewCourse.CursoID}:`, error);
                        }
                    }
                }
            } console.log('Cursos formatados com detalhes:', cursosFormatados);

            setStudentData(loginDataFixed.aluno);
            setStudentCourses(cursosFormatados);
            setShowPortal(true);
        } catch (error) {
            console.error('Error during login:', error);
            setLoginError('Erro de conexão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }; const handleCourseSelect = (curso: { id: number; titulo: string; valor?: number }) => {
        console.log('handleCourseSelect: studentData =', studentData);
        if (!studentData) return;

        // Verificar se o aluno já está inscrito neste curso
        const isEnrolled = studentCourses.some(c => c.id === curso.id);
        if (isEnrolled) {
            alert('Você já está inscrito neste curso!');
            setCourseSelectorOpen(false);
            return;
        }

        // Abrir o fluxo de pagamento
        console.log('Abrindo EnrollmentFlow com studentData:', studentData);
        setEnrollmentFlow({
            isOpen: true,
            courseName: curso.titulo,
            coursePrice: curso.valor || 299.90,
            courseId: curso.id
        });
        setCourseSelectorOpen(false);
    };

    const handleCloseEnrollment = () => {
        setEnrollmentFlow(prev => ({ ...prev, isOpen: false }));
        // Recarregar cursos após fechamento (caso tenha havido uma compra)
        if (studentData) {
            reloadStudentCourses();
        }
    };

    const reloadStudentCourses = async () => {
        if (!studentData) return;

        try {
            // Recarregar os cursos do aluno
            const cursosResponse = await fetch(`${API_URL}/vw/alunos-cursos-pagamentos/${studentData.id}`);
            const cursosData = await cursosResponse.json();
            const cursosDataFixed = fixObjectEncoding(cursosData);
            if (cursosData.executedQuery) addQuery(cursosData.executedQuery, `GET /vw/alunos-cursos-pagamentos/${studentData.id}`);

            // Reprocessar cursos (mesmo código do login)
            const cursosFormatados: StudentCourse[] = [];
            if (cursosDataFixed.rows && cursosDataFixed.rows.length > 0) {
                for (const item of cursosDataFixed.rows) {
                    const viewCourse = item as StudentCourseFromView;
                    if (viewCourse.CursoID) {
                        try {
                            const cursoDetailResponse = await fetch(`${API_URL}/cursos/${viewCourse.CursoID}`);
                            const cursoDetailData = await cursoDetailResponse.json();

                            if (cursoDetailData.rows && cursoDetailData.rows[0]) {
                                const detailedCourse = cursoDetailData.rows[0] as DetailedCourse;
                                const detailedCourseFixed = fixObjectEncoding(detailedCourse); const relationResponse = await fetch(`${API_URL}/alunos-cursos/relation/${studentData.id}/${viewCourse.CursoID}`);
                                const relationData = await relationResponse.json();

                                let alunosCursosId: number | undefined = undefined;
                                if (relationData.rows && relationData.rows[0]) {
                                    alunosCursosId = relationData.rows[0].id;
                                }

                                cursosFormatados.push({
                                    id: detailedCourseFixed.id,
                                    alunosCursosId: alunosCursosId,
                                    titulo: detailedCourseFixed.titulo,
                                    descricao: detailedCourseFixed.descricao,
                                    duracao_horas: detailedCourseFixed.duracao_horas,
                                    valor: detailedCourseFixed.valor,
                                    professor_nome: detailedCourseFixed.nome_professor,
                                    nome_area: detailedCourseFixed.nome_area,
                                    data_inscricao: viewCourse.DataInscricao
                                });
                            }
                        } catch (error) {
                            console.error(`Erro ao buscar detalhes do curso ${viewCourse.CursoID}:`, error);
                        }
                    }
                }
            }

            setStudentCourses(cursosFormatados);
        } catch (error) {
            console.error('Erro ao recarregar cursos:', error);
        }
    };// Handlers para o feedback
    const handleOpenFeedback = (alunosCursosId: number, courseTitle: string) => {
        setFeedbackModal({
            isOpen: true,
            alunosCursosId,
            courseTitle
        });
    };

    const handleCloseFeedback = () => {
        setFeedbackModal({
            isOpen: false,
            alunosCursosId: 0,
            courseTitle: ''
        });
    };

    if (!isOpen) return null;

    if (showPortal) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-start justify-center p-4 pt-20 min-h-screen overflow-y-auto">
                <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-slate-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 z-10">
                        <div className="flex items-center space-x-3">
                            <GraduationCap className="h-8 w-8 text-blue-600" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Portal do Aluno
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Bem-vindo(a), {studentData?.nome}!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setShowPortal(false);
                                onClose();
                                setCredentials({ email: '', password: '' });
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            Cursos Inscritos
                                        </p>                                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                            {studentCourses.length}
                                        </p>
                                    </div>
                                    <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                            Progresso Médio
                                        </p>                                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                            {studentCourses.length > 0 ? '68%' : '0%'}
                                        </p>
                                    </div>
                                    <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>                                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                        Próximas Atividades
                                    </p>
                                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                            {studentCourses.length}
                                        </p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* My Courses */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Meus Cursos
                                </h3>                                <div className="space-y-4">
                                    {studentCourses.length > 0 ? (
                                        studentCourses.map((course) => (
                                            <div key={course.id} className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-600 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                                            {course.titulo}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                                            {course.descricao}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                                        <span>{course.duracao_horas}h de duração</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                                        <span>R$ {course.valor.toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <User className="h-4 w-4 mr-2 text-purple-500" />
                                                        <span>Professor: {course.professor_nome}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <BookOpen className="h-4 w-4 mr-2 text-orange-500" />
                                                        <span>Área: {course.nome_area}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <Calendar className="h-4 w-4 mr-2 text-teal-500" />
                                                        <span>Inscrito em: {new Date(course.data_inscricao).toLocaleDateString('pt-BR')}</span>
                                                    </div>
                                                </div>                                                <div className="space-y-2">
                                                    <button className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                                        Acessar Curso
                                                    </button>
                                                    {course.alunosCursosId && (
                                                        <button
                                                            onClick={() => handleOpenFeedback(course.alunosCursosId!, course.titulo)}
                                                            className="w-full bg-yellow-500 text-white py-2.5 px-4 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
                                                            title="Avaliar Curso"
                                                        >
                                                            <Star className="h-4 w-4" />
                                                            <span>Avaliar Curso</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                                Você ainda não está inscrito em nenhum curso.
                                            </p>                                            <button
                                                onClick={() => setCourseSelectorOpen(true)}
                                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Explorar Cursos
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Informações do Aluno */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Suas Informações
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                                        <div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Nome:</span>
                                            <p className="text-gray-900 dark:text-white font-medium">{studentData?.nome}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                                            <p className="text-gray-900 dark:text-white font-medium">{studentData?.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Telefone:</span>
                                            <p className="text-gray-900 dark:text-white font-medium">{studentData?.telefone || 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${studentData?.status_pagamento === 'ativo'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                                }`}>
                                                {studentData?.status_pagamento}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Comprar Mais Cursos */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Explore Mais Cursos
                                    </h3>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                        <p className="text-blue-700 dark:text-blue-300 mb-3">
                                            Amplie seus conhecimentos! Explore nossa variedade de cursos disponíveis.
                                        </p>                                        <button
                                            onClick={() => setCourseSelectorOpen(true)}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Ver Todos os Cursos
                                        </button>
                                    </div>
                                </div>
                            </div>                        </div>
                    </div>                    {/* Course Selector Modal */}
                    <CourseSelector
                        isOpen={courseSelectorOpen}
                        onClose={() => setCourseSelectorOpen(false)}
                        onSelectCourse={handleCourseSelect}
                        enrolledCourseIds={studentCourses.map(course => course.id)}
                    />

                    {/* Enrollment Flow Modal */}
                    <EnrollmentFlow
                        isOpen={enrollmentFlow.isOpen}
                        onClose={handleCloseEnrollment}
                        courseName={enrollmentFlow.courseName}
                        coursePrice={enrollmentFlow.coursePrice}
                        courseId={enrollmentFlow.courseId}
                        studentData={studentData || undefined}
                    />

                    {/* Feedback Modal */}
                    <FeedbackModal
                        isOpen={feedbackModal.isOpen}
                        onClose={handleCloseFeedback}
                        alunosCursosId={feedbackModal.alunosCursosId}
                        courseTitle={feedbackModal.courseTitle}
                    />
                </div>
            </div>
        );
    } return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-start justify-center p-4 pt-20 min-h-screen overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 max-w-md w-full mx-4 my-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Portal do Aluno
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-6 w-6" />
                    </button>                    </div>

                {/* Error Message */}
                {loginError && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-red-800 dark:text-red-200 font-medium">
                                    Erro no Login
                                </h4>
                                <p className="text-red-700 dark:text-red-300 text-sm">
                                    {loginError}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setLoginError('');
                                    setCredentials({ email: '', password: '' });
                                }}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                Lembrar-me
                            </span>
                        </label>
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            Esqueci a senha
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Entrando...</span>
                            </>
                        ) : (
                            <span>Entrar</span>
                        )}
                    </button>
                </form>            </div>            {/* Course Selector Modal */}
            <CourseSelector
                isOpen={courseSelectorOpen}
                onClose={() => setCourseSelectorOpen(false)}
                onSelectCourse={handleCourseSelect}
                enrolledCourseIds={studentCourses.map(course => course.id)}
            />

            {/* Enrollment Flow Modal */}
            <EnrollmentFlow
                isOpen={enrollmentFlow.isOpen}
                onClose={handleCloseEnrollment}
                courseName={enrollmentFlow.courseName}
                coursePrice={enrollmentFlow.coursePrice}
                courseId={enrollmentFlow.courseId}
                studentData={studentData || undefined}
            />

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={feedbackModal.isOpen}
                onClose={handleCloseFeedback}
                alunosCursosId={feedbackModal.alunosCursosId}
                courseTitle={feedbackModal.courseTitle}
            />
        </div>
    );
}
