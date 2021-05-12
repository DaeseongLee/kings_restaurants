import { LOCAL_STORAGE_TOKEN } from './constant';
import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

export const client = new ApolloClient({
    uri: 'http://localhost:4500/graphql',
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    isLoggedIn: {
                        read() {
                            return isLoggedInVar();
                        }
                    }
                }
            }
        }
    })
});