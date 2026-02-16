
import React from 'react';
import { FileText, Download, Printer, Filter, Calendar, BarChart as ChartIcon, Layers, TrendingDown } from 'lucide-react';
import { Sale } from '../types';

interface ReportsViewProps {
  sales: Sale[];
}

// Add ReportsViewProps to React.FC to accept sales prop passed from App.tsx
const ReportsView: React.FC<ReportsViewProps> = ({ sales }) => {
  const reports = [
    { title: 'Vendas por Período', desc: 'Relatório detalhado de todas as transações', icon: FileText, color: 'text-blue-500' },
    { title: 'Lucro Líquido', desc: 'Visão real do resultado após descontos e custos', icon: ChartIcon, color: 'text-emerald-500' },
    { title: 'Estoque Parado', desc: 'Produtos sem giro há mais de 60 dias', icon: Layers, color: 'text-amber-500' },
    { title: 'Fluxo de Caixa', desc: 'Entradas e saídas consolidadas por dia', icon: TrendingDown, color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Relatórios Estratégicos</h2>
          <p className="text-slate-500 mt-1">Dados precisos para o crescimento da Lumateck</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Calendar size={18} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-600">01/03/2024 - 31/03/2024</span>
          </div>
          <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-400">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6 group">
            <div className={`w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center ${rep.color} group-hover:scale-110 transition-transform`}>
              <rep.icon size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800">{rep.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{rep.desc}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button className="p-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors" title="Download PDF">
                <Download size={20} />
              </button>
              <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors" title="Imprimir">
                <Printer size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-800 text-xl mb-8">Destaque de Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Giro de Estoque</p>
            <h4 className="text-3xl font-black text-[#1E3A8A]">4.2x</h4>
            <div className="w-full bg-slate-100 h-1 rounded-full">
              <div className="bg-[#1E3A8A] w-[70%] h-full rounded-full"></div>
            </div>
            <p className="text-xs text-emerald-500 font-bold">+0.5 em relação ao mês anterior</p>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Margem Contribuição</p>
            <h4 className="text-3xl font-black text-purple-600">38.4%</h4>
            <div className="w-full bg-slate-100 h-1 rounded-full">
              <div className="bg-purple-600 w-[85%] h-full rounded-full"></div>
            </div>
            <p className="text-xs text-emerald-500 font-bold">Meta atingida</p>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Inadimplência</p>
            <h4 className="text-3xl font-black text-rose-500">2.1%</h4>
            <div className="w-full bg-slate-100 h-1 rounded-full">
              <div className="bg-rose-500 w-[15%] h-full rounded-full"></div>
            </div>
            <p className="text-xs text-emerald-500 font-bold">-0.8% em relação ao mês anterior</p>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">ROI Marketing</p>
            <h4 className="text-3xl font-black text-slate-800">8.5x</h4>
            <div className="w-full bg-slate-100 h-1 rounded-full">
              <div className="bg-slate-800 w-[60%] h-full rounded-full"></div>
            </div>
            <p className="text-xs text-slate-400 font-bold">Acima da média do setor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
