# GraphQL API Endpoint Configuration

## ✅ Endpoint Updated

The GraphQL API endpoint has been configured to:
```
https://keeper.in-brackets.online/graphql
```

## 📝 Configuration

### Default Endpoint
The default endpoint in `lib/graphql.js` is now set to:
```javascript
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://keeper.in-brackets.online/graphql';
```

### Environment Variable (Optional)
You can override the endpoint by creating a `.env.local` file in the project root:

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://keeper.in-brackets.online/graphql
```

## ✅ Build Status

The project builds successfully with the new endpoint:
- ✅ All pages compile correctly
- ✅ No errors in build
- ✅ Ready for deployment

## 🚀 Next Steps

1. **Test the Connection**: Run `npm run dev` and check if data loads from the API
2. **Verify API**: The endpoint should respond to GraphQL queries
3. **Deploy**: The project is ready for Vercel deployment

## 📍 API Endpoint

**URL**: https://keeper.in-brackets.online/graphql

**Status**: ✅ Configured and ready

**Note**: The API uses Laravel Lighthouse (as seen in the error trace), which is compatible with our GraphQL queries.
