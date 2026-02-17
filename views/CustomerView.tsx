
import React, { useState } from 'react';
import { UserPlus, Search, Phone, Mail, Trash2, X, Edit, Users } from 'lucide-react';
import { Customer } from '../types';

interface CustomerViewProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomerView: React.FC<CustomerViewProps> = ({ customers, setCustomers }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '', phone: '', cpf: '', email: '', birthday: '', address: ''
  });

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.cpf.includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', cpf: '', email: '', birthday: '', address: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData(c);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } as Customer : c));
    } else {
      const customer: Customer = {
        ...formData as Customer,
        id: `c-${Date.now()}`,
        totalSpent: 0
      };
      setCustomers([customer, ...customers]);
    }
    setShowModal(false);
  };

  const deleteCustomer = (id: string) => {
    if (confirm("Excluir cliente permanentemente?")) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 gap-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou CPF..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#6D28D9] text-white rounded-xl font-bold shadow-lg hover:opacity-90"
        >
          <UserPlus size={20} />
          NOVO CLIENTE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((customer) => (
          <div key={customer.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleOpenEdit(customer)} className="p-2 text-slate-300 hover:text-blue-500 transition-colors"><Edit size={16} /></button>
              <button onClick={() => deleteCustomer(customer.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-black shadow-sm">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{customer.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{customer.cpf}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Phone size={14} className="text-slate-300" /> <span>{customer.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Mail size={14} className="text-slate-300" /> <span className="truncate">{customer.email || 'Sem e-mail'}</span>
              </div>
              <div className="flex items-center justify-between mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Gasto</span>
                <span className="font-black text-[#1E3A8A] text-lg">R$ {customer.totalSpent.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="flex flex-col items-center text-slate-300">
              <Users size={48} className="mb-4 opacity-20" />
              <p className="font-bold uppercase text-xs tracking-widest">Nenhum cliente encontrado</p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl relative animate-scaleIn">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <h2 className="text-2xl font-black text-slate-800 mb-6">
              {editingCustomer ? 'Editar Cliente' : 'Cadastrar Cliente'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nome Completo</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">WhatsApp / Telefone</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">CPF</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">E-mail</label>
                <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-500 border border-slate-200 rounded-2xl">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-[#1E3A8A] text-white font-black rounded-2xl shadow-xl">
                  {editingCustomer ? 'ATUALIZAR' : 'SALVAR CLIENTE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerView;
