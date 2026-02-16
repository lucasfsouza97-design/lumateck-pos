
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, DollarSign, BarChart3, LogOut, Menu, X, Bell, Search, Lock } from 'lucide-react';
import { MOCK_USER, MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_TRANSACTIONS } from './constants';
import { Product, Customer, Sale, Transaction } from './types';
import DashboardView from './views/DashboardView';
import POSView from './views/POSView';
import InventoryView from './views/InventoryView';
import CustomerView from './views/CustomerView';
import FinanceView from './views/FinanceView';
import ReportsView from './views/ReportsView';

type ViewType = 'dashboard' | 'pos' | 'inventory' | 'customers' | 'finance' | 'reports';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });

  // Estados Globais com Persistência
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lumateck_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('lumateck_customers');
    return saved ? JSON.parse(saved) : MOCK_CUSTOMERS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('lumateck_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('lumateck_transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('lumateck_products', JSON.stringify(products));
    localStorage.setItem('lumateck_customers', JSON.stringify(customers));
    localStorage.setItem('lumateck_sales', JSON.stringify(sales));
    localStorage.setItem('lumateck_transactions', JSON.stringify(transactions));
  }, [products, customers, sales, transactions]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === 'admin' && loginForm.pass === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Usuário ou senha incorretos! (Padrão: admin / admin)');
    }
  };

  const handleCompleteSale = (newSale: Sale) => {
    setSales([...sales, newSale]);
    const updatedProducts = products.map(p => {
      const soldItem = newSale.items.find(item => item.product.id === p.id);
      if (soldItem) return { ...p, stock: p.stock - soldItem.quantity };
      return p;
    });
    setProducts(updatedProducts);

    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      type: 'RECEBER',
      description: `Venda #${newSale.id.slice(-4)}`,
      amount: newSale.total,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'PAGO',
      category: 'Vendas'
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const addManualTransaction = (t: Transaction) => {
    setTransactions([t, ...transactions]);
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen w-screen bg-[#1E3A8A] flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl animate-scaleIn">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-[#1E3A8A]" />
            </div>
            <h1 className="text-3xl font-black text-slate-800">Lumateck</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Acesso ao Sistema</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Usuário</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: admin"
                value={loginForm.user}
                onChange={e => setLoginForm({...loginForm, user: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Senha</label>
              <input 
                type="password" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                value={loginForm.pass}
                onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full py-5 bg-gradient-to-r from-[#1E3A8A] to-[#6D28D9] text-white font-black rounded-2xl shadow-xl hover:opacity-90 transition-all active:scale-95">
              ENTRAR NO SISTEMA
            </button>
          </form>
          <p className="text-center text-slate-300 text-[10px] mt-8 font-bold uppercase">Lumateck v1.0.0 - Todos os direitos reservados</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'PDV / Vendas', icon: ShoppingCart },
    { id: 'inventory', label: 'Estoque', icon: Package },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView sales={sales} products={products} />;
      case 'pos': return <POSView products={products} onCompleteSale={handleCompleteSale} />;
      case 'inventory': return <InventoryView products={products} setProducts={setProducts} />;
      case 'customers': return <CustomerView customers={customers} setCustomers={setCustomers} />;
      case 'finance': return <FinanceView transactions={transactions} onAddTransaction={addManualTransaction} />;
      case 'reports': return <ReportsView sales={sales} />;
      default: return <DashboardView sales={sales} products={products} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#1E3A8A] text-white transition-all duration-300 flex flex-col z-50 shadow-2xl`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="font-black text-xl tracking-tight">Lumateck</h1>
              <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Sistemas</p>
            </div>
          )}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-gradient-to-r from-white/20 to-[#6D28D9] text-white shadow-lg' 
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className={`w-6 h-6 shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {isSidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center p-3 rounded-xl text-white/50 hover:bg-red-500/20 hover:text-red-300 transition-all">
            <LogOut className={`w-6 h-6 shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {isSidebarOpen && <span className="font-bold text-sm">Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-80">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Busca rápida..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800">{MOCK_USER.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Administrador</p>
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-[#1E3A8A] to-[#6D28D9] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg border-2 border-white">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-8">
          <div className="max-w-7xl mx-auto">
             {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
