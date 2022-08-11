import { EventEmitter } from "events";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const API_URL = "https://api.twetch.app/v1/graphiql"

const lastCall = async () => {
    const client = new ApolloClient({
        uri: API_URL,
        cache: new InMemoryCache(),
    });
    const query={}
    const [result] = [null]
    return result
} 

export async function twetchsocket(): Promise<EventEmitter> {
//This is not a real socket, this is not really onchain. #quick & dirty     
    
    let last = await lastCall()
    let prevCount = last.length
    
    while(true){
        try {
            last = await lastCall();
            let count = last.length;

            if(count > prevCount) {
                let diff = count - prevCount;
                console.log("new entries found: ", diff);
                for (let i = 0; i < diff; i++) {
                    let post = last[i]
                    const replyTx = post.replyTx
                    const callerId = post.userId
                    
                    const output = `Boosting this post: http://twetch.com/t/${replyTx} on behalf of u/${callerId}`
                    console.log(`Boosting this post: http://twetch.com/t/${replyTx} on behalf of u/${callerId}` )
                }
            }
        } catch (error) {

            console.log("ERROR", error)
            
        }
    }

    
}