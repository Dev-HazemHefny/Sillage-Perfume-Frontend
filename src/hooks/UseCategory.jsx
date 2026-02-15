import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
const UseCategory = () => {
    function getCategories(){
      return axios.get("http://localhost:5000/api/categories");
    }
    let categories = useQuery({
        queryKey:["categories"],
        queryFn:getCategories,
        staleTime:5000,
        retry:3
        });
    return categories;
}

export default UseCategory;
