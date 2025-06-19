import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";

/**
 * Generic hook to manage paginated + searchable list.
 *
 * @param {Object} config
 * @param {(page: number) => Promise<any>} config.fetchFn - Function to fetch paginated data.
 * @param {(params: object) => Promise<any>} config.searchFn - Function to search data.
 * @param {(res: any) => Array<any>} config.extractList - Extracts array of items from response.
 * @param {(res: any) => number} config.extractTotalPages - Extracts total page count from response.
 * @param {number} config.debounceDelay - Debounce delay in ms (default 500).
 * @param {string} config.searchKey - Key name for search query param (default "value").
 *
 * @returns Object with state and handlers.
 */

export default function usePaginatedSearchList({
  fetchFn,
  searchFn,
  extractList = (res) => res?.data ?? [],
  extractTotalPages = (res) => res?.totalPages ?? 1,
  debounceDelay = 500,
  searchKey = "value",
}) {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch paginated data
  const fetchData = async (reset = false) => {
    const page = reset ? 1 : currentPage;
    const res = await fetchFn(page);
    const items = extractList(res);
    const total = extractTotalPages(res);

    if (reset) {
      setData(items);
      setCurrentPage(2);
    } else {
      setData((prev) => [...prev, ...items]);
      setCurrentPage((prev) => prev + 1);
    }

    setTotalPages(total);
    setInitialLoading(false);
  };

  // Fetch search results
  const fetchSearch = async (query) => {
    const res = await searchFn({ [searchKey]: query });
    console.log("res", res);
    
    const items = extractList(res);
    setData(items);
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim()) {
        setIsSearching(true);
        fetchSearch(value.trim());
      } else {
        setIsSearching(false);
        fetchData(true);
      }
    }, debounceDelay),
    []
  );

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (isSearching && searchTerm.trim()) {
      await fetchSearch(searchTerm.trim());
    } else {
      await fetchData(true);
    }
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!isSearching && currentPage <= totalPages) {
      setLoadingMore(true);
      await fetchData();
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    return () => debouncedSearch.cancel();
  }, []);

  return {
    data,
    searchTerm,
    isSearching,
    refreshing,
    initialLoading,
    loadingMore,
    handleSearchChange,
    handleRefresh,
    loadMore,
    canLoadMore: !isSearching && currentPage <= totalPages,
  };
}
