import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Buscar..." }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(term);
  };

  const handleClear = () => {
    setTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      {term && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <X size={18} className="text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;