
import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Users, Target, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sale, Product } from '../types';

interface DashboardProps {
  sales: Sale[];
  products: Product[];
}

const DashboardView: React.FC<DashboardProps> = ({ sales, products }) => {
  // Cálculos Reais
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const dailyRevenue = sales
    .filter(s => s.date.split('T')[0] === new Date().toISOString().split('T')[0])
    .reduce((acc, s) => acc + s.total, 0);
    
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalStockValue = products.reduce((acc, p) => acc + (p.costPrice * p.stock), 0);

  // Dados para o gráfico (últimos 7 dias simplificado)
  const chartData = sales.slice(-7).map(s => ({
    name: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    sales: s.total
  }));

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start hover:shadow-md transition-all">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
        {trend && (
          <span className={`text-[10px] font-black mt-2 flex items-center px-2 py-0.5 rounded-lg w-fit ${trend > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className={`p-3.5 rounded-2xl shadow-lg ${color}`}>
        <Icon className="text-white w-6 h-6" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Faturamento Hoje" value={`R$ ${dailyRevenue.toLocaleString('pt-br')}`} icon={TrendingUp} color="bg-blue-600" trend={12} />
        <StatCard title="Total em Vendas" value={`R$ ${totalRevenue.toLocaleString('pt-br')}`} icon={ShoppingBag} color="bg-purple-600" />
        <StatCard title="Valor em Estoque" value={`R$ ${totalStockValue.toLocaleString('pt-br')}`} icon={DollarSign} color="bg-indigo-600" />
        <StatCard title="Alertas de Estoque" value={lowStockCount} icon={AlertTriangle} color={lowStockCount > 0 ? "bg-rose-500" : "bg-emerald-500"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8">Fluxo de Vendas Recentes</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : [{name: 'Sem dados', sales: 0}]}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="sales" stroke="#1E3A8A" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Target size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Saúde do Negócio</h3>
          <p className="text-slate-400 text-sm mb-6">Seu ticket médio está em R$ {(totalRevenue / (sales.length || 1)).toFixed(2)}</p>
          
          <div className="relative w-40 h-40 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="#6D28D9" strokeWidth="12" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.75)} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-800">75%</span>
            </div>
          </div>
          <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all">Relatório Completo</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
