import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('vw')
export class VwController {
    constructor(private db: DatabaseService) { }

    @Get('alunos-cursos-pagamentos')
    async getAlunosCursosPagamentos() {
        // A VIEW foi criada em 'catalogo.vw_AlunosCursosPagamentos'
        const query = 'SELECT * FROM catalogo.vw_AlunosCursosPagamentos';
        return this.db.executeQuery(query);
    }

    @Get('alunos-cursos-pagamentos/:alunoId')
    async getAlunosCursosPagamentosByAluno(@Param('alunoId') alunoId: string) {
        // Filtrar os dados da view por um aluno específico
        const query = 'SELECT * FROM catalogo.vw_AlunosCursosPagamentos WHERE AlunoID = @param0';
        return this.db.executeQuery(query, [+alunoId]);
    }
}
