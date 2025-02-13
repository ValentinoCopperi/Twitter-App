"use client"

import React, { useState, useEffect, ChangeEvent } from 'react';
import { getUsersByUsername } from '@/actions/users/user-actions';
import { User } from '@prisma/client';
import { Input } from '@/components/ui/input';
import UserBar from './user-bar';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<User[]>([]);

    const debouncedQuery = useDebounce(query, 300);

    const searchUsers = async (searchQuery: string) => {
        if (searchQuery.length < 1) {
            setResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const users = await getUsersByUsername(searchQuery);
            setResults(users || []);
        } catch (error) {
            console.error('Error in search:', error);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        searchUsers(debouncedQuery);
    }, [debouncedQuery]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };


    return (
        <div className="w-full  relative z-30">
            <Input
                placeholder="Search users..."
                type="search"
                value={query}
                onChange={handleInputChange}
                className="w-full"
            />

            {
                query.length > 0 && (
                    <div className="min-h-[50px] absolute  w-full bg-white dark:bg-gray-900 shadow-md rounded-md overflow-hidden">
                        {isSearching ? (
                            <p className="text-gray-500 text-center ">Searching...</p>
                        ) : (
                            <ul className="space-y-2">
                                {results.length > 0 ? (
                                    results.map((user) => (
                                       <UserBar key={user.id} user={user} />
                                    ))
                                ) : query.length >= 3 ? (
                                    <p className="text-gray-500 text-center">No users found</p>
                                ) : null}
                            </ul>
                        )}
                    </div>
                )
            }
        </div>
    );
};

export default SearchBar;