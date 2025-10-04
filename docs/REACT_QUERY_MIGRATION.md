# React Query Migration Guide

## 🚀 What We've Implemented

We've successfully migrated from our custom API hooks to **React Query (TanStack Query)**, the industry standard for data fetching in React applications.

## 📦 What's Included

### 1. **Query Client Setup** (`lib/query-client.tsx`)

- Configured QueryClient with optimal defaults
- DevTools integration for debugging
- Proper error handling and retry logic

### 2. **React Query Hooks** (`lib/hooks/use-react-query.ts`)

- **Asset Queries**: `useAssets()`, `useAsset(id)`
- **User Queries**: `useCurrentUser()`
- **Loan Queries**: `useLoans()`
- **Mutations**: `useCreateAsset()`, `useUpdateAsset()`, `useDeleteAsset()`
- **Auth Mutations**: `useLogin()`, `useRegister()`

### 3. **Enhanced Components**

- **AssetsStats**: Real-time statistics with automatic updates
- **AssetCard**: Optimistic updates and instant UI feedback
- **Updated existing components** to use React Query

## 🎯 Key Benefits

### ✅ **Automatic Caching**

```typescript
// Data is cached automatically
const { data: assets } = useAssets(); // Cached for 5 minutes
const { data: user } = useCurrentUser(); // Cached for 10 minutes
```

### ✅ **Background Refetching**

```typescript
// Data stays fresh automatically
// Refetches when window regains focus
// Refetches when network reconnects
```

### ✅ **Optimistic Updates**

```typescript
const updateAsset = useUpdateAsset();
// UI updates immediately, rolls back on error
updateAsset.mutate({ id, data });
```

### ✅ **Smart Invalidation**

```typescript
// When you create an asset, the assets list automatically updates
const createAsset = useCreateAsset();
createAsset.mutate(formData); // Assets list refreshes automatically
```

### ✅ **Loading States**

```typescript
const { data, isLoading, error } = useAssets();
// Built-in loading and error states
```

### ✅ **DevTools**

- Open React Query DevTools in browser
- Inspect queries, mutations, and cache
- Debug performance issues

## 🔄 Migration Changes

### Before (Custom Hooks)

```typescript
const { data: assets, loading, error } = useAssets();
```

### After (React Query)

```typescript
const { data: assets, isLoading, error } = useAssets();
```

## 🚀 Advanced Features

### **Prefetching**

```typescript
const prefetchAsset = usePrefetchAsset();
// Prefetch asset data before user clicks
prefetchAsset(assetId);
```

### **Optimistic Updates**

```typescript
const updateAsset = useUpdateAsset();
// UI updates immediately, server syncs in background
updateAsset.mutate({ id, data });
```

### **Background Sync**

```typescript
// Data automatically stays fresh
// No manual refresh needed
const { data } = useAssets(); // Always up-to-date
```

## 📊 Performance Improvements

1. **Reduced API Calls**: Smart caching prevents duplicate requests
2. **Faster UI**: Optimistic updates make UI feel instant
3. **Better UX**: Background updates keep data fresh
4. **Error Recovery**: Automatic retries and error boundaries

## 🛠️ Usage Examples

### **Basic Data Fetching**

```typescript
function AssetsList() {
  const { data: assets, isLoading, error } = useAssets();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {assets.map((asset) => (
        <AssetCard key={asset._id} asset={asset} />
      ))}
    </div>
  );
}
```

### **Mutations with Optimistic Updates**

```typescript
function CreateAssetForm() {
  const createAsset = useCreateAsset();

  const handleSubmit = (formData) => {
    createAsset.mutate(formData, {
      onSuccess: () => {
        // Assets list automatically updates
        toast.success("Asset created!");
      },
    });
  };
}
```

### **Real-time Statistics**

```typescript
function AssetsStats() {
  const { data: assets } = useAssets();

  // Automatically recalculates when assets change
  const totalWorth = assets.reduce((sum, asset) => sum + asset.assetWorth, 0);

  return <div>Total Worth: ${totalWorth}</div>;
}
```

## 🎨 DevTools

1. Install React Query DevTools: `npm install @tanstack/react-query-devtools`
2. Open browser DevTools
3. Look for "React Query" tab
4. Inspect queries, mutations, and cache

## 🔧 Configuration

### **Query Client Settings**

- **Stale Time**: 5 minutes (data stays fresh)
- **Cache Time**: 30 minutes (data stays in cache)
- **Retry Logic**: Smart retry for failed requests
- **Background Refetch**: Disabled on window focus (configurable)

### **Customizing Behavior**

```typescript
// Override defaults for specific queries
const { data } = useAssets({
  staleTime: 1000 * 60 * 10, // 10 minutes
  refetchInterval: 1000 * 30, // Refetch every 30 seconds
});
```

## 🚀 Next Steps

1. **Explore DevTools**: Open React Query DevTools to see caching in action
2. **Add More Features**: Implement pagination, infinite scroll, etc.
3. **Optimize Queries**: Add more specific query keys for better caching
4. **Error Boundaries**: Add error boundaries for better error handling

## 📚 Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Best Practices](https://tkdodo.eu/blog/practical-react-query)

---

**🎉 Congratulations!** You now have a production-ready, industry-standard data fetching solution that's more powerful and maintainable than our custom implementation.
