// src/components/Common/AdvancedSearch.tsx
import React, { useState } from 'react';
import { Search, Filter, X, Calendar, DollarSign, Package, Users } from 'lucide-react';

interface FilterOption {
  field: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select';
  options?: { value: string; label: string }[];
}

interface AdvancedSearchProps {
  onSearch: (filters: any) => void;
  onClear: () => void;
  options?: FilterOption[];
  placeholder?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onClear,
  options = [],
  placeholder = "Pesquisar..."
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleSearch = () => {
    onSearch({ searchTerm, ...filters });
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilters({});
    onClear();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="input-field pl-10 pr-4"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            showFilters
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter size={18} />
        </button>
        {(searchTerm || Object.keys(filters).length > 0) && (
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="card animate-fade-in">
          <h3 className="font-semibold text-gray-900 mb-3">Filtros Avançados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {options.map((option) => (
              <div key={option.field}>
                <label className="input-label text-sm">{option.label}</label>
                {option.type === 'select' ? (
                  <select
                    className="input-field"
                    value={filters[option.field] || ''}
                    onChange={(e) => setFilters({ ...filters, [option.field]: e.target.value })}
                  >
                    <option value="">Todos</option>
                    {option.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : option.type === 'date' ? (
                  <input
                    type="date"
                    className="input-field"
                    value={filters[option.field] || ''}
                    onChange={(e) => setFilters({ ...filters, [option.field]: e.target.value })}
                  />
                ) : (
                  <input
                    type={option.type}
                    className="input-field"
                    placeholder={option.label}
                    value={filters[option.field] || ''}
                    onChange={(e) => setFilters({ ...filters, [option.field]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-3">
            <button onClick={handleSearch} className="btn-primary">
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;