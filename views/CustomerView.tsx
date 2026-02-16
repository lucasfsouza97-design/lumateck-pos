
import React, { useState } from 'react';
import { UserPlus, Search, Phone, Mail, Calendar, Trash2, X } from 'lucide-react';
import { Customer } from '../types';

interface CustomerViewProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomerView: React.FC<CustomerViewProps> = ({ customers, setCustomers }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCust, setNewCust] = useState<Partial<Customer>>({
    name: '', phone: '', cpf: '', email: '', birthday: '', address: ''
  });

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.cpf.includes(searchTerm)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      ...newCust as Customer,
      id: `c-${Date.now()}`,
      totalSpent: 0
    };
    setCustomers([customer, ...customers]);
    setShowModal(false);
    setNewCust({ name: '', phone: '', cpf: '', email: '', birthday: '', address: '' });
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
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#6D28D9] text-white rounded-xl font-bold shadow-lg"
        >
          <UserPlus size={20} />
          NOVO CLIENTE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((customer) => (
          <div key={customer.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
            <button 
              onClick={() => deleteCustomer(customer.id)}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-black">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{customer.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{customer.cpf}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Phone size={14} /> <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Mail size={14} /> <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center justify-between mt-4 bg-slate-50 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Gasto</span>
                <span className="font-black text-[#1E3A8A]">R$ {customer.totalSpent.toLocaleString('pt-br')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>
            <h2 className="text-2xl font-black text-slate-800 mb-6">Cadastrar Cliente</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Nome Completo</label>
                <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">WhatsApp</label>
                <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">CPF</label>
                <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={newCust.cpf} onChange={e => setNewCust({...newCust, cpf: e.target.value})} />
              </div>
              <div className="col-span-2">
                <button type="submit" className="w-full py-4 bg-[#1E3A8A] text-white font-black rounded-xl">SALVAR CLIENTE</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerView;
