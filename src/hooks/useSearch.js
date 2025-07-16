import { useState, useMemo, useCallback } from 'react';
import { debounce } from '../utils/debounce';

export const useSearch = (data, delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 防抖处理
  const debouncedSetSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
    }, delay),
    [delay]
  );

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSetSearch(value);
  }, [debouncedSetSearch]);

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) {
      return data;
    }
    
    const lowercasedFilter = debouncedSearchTerm.toLowerCase();
    const filtered = {};
    
    for (const topCategory in data) {
      filtered[topCategory] = {};
      
      for (const midCategory in data[topCategory]) {
        if (Array.isArray(data[topCategory][midCategory])) {
          const apps = data[topCategory][midCategory].filter((app) =>
            app.name.toLowerCase().includes(lowercasedFilter)
          );
          if (apps.length > 0) {
            filtered[topCategory][midCategory] = apps;
          }
        } else {
          filtered[topCategory][midCategory] = {};
          
          for (const subCategory in data[topCategory][midCategory]) {
            if (Array.isArray(data[topCategory][midCategory][subCategory])) {
              const apps = data[topCategory][midCategory][subCategory].filter((app) =>
                app.name.toLowerCase().includes(lowercasedFilter)
              );
              if (apps.length > 0) {
                filtered[topCategory][midCategory][subCategory] = apps;
              }
            } else {
              filtered[topCategory][midCategory][subCategory] = {};
              
              for (const finalCategory in data[topCategory][midCategory][subCategory]) {
                const apps = data[topCategory][midCategory][subCategory][finalCategory].filter(
                  (app) => app.name.toLowerCase().includes(lowercasedFilter)
                );
                if (apps.length > 0) {
                  filtered[topCategory][midCategory][subCategory][finalCategory] = apps;
                }
              }
              
              if (Object.keys(filtered[topCategory][midCategory][subCategory]).length === 0) {
                delete filtered[topCategory][midCategory][subCategory];
              }
            }
          }
          
          if (Object.keys(filtered[topCategory][midCategory]).length === 0) {
            delete filtered[topCategory][midCategory];
          }
        }
      }
      
      if (Object.keys(filtered[topCategory]).length === 0) {
        delete filtered[topCategory];
      }
    }
    
    return filtered;
  }, [data, debouncedSearchTerm]);

  return {
    searchTerm,
    filteredData,
    handleSearchChange,
    isSearching: searchTerm !== debouncedSearchTerm
  };
};
