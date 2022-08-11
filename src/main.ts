import { bitsocket } from "./bitsocket"
import { boost } from "./boost"
import postTwetch from "./twetch/post-twetch"
import { twetchsocket } from "./twetchsocket"

const TWETCH_APP_ID = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"

export async function start() {

    console.log("server started")
    
    //twetchsocket()


    const boostbot = bitsocket(TWETCH_APP_ID)

    boostbot.on('order',async (event)=> {

        console.log("new boost order found. target: ", event.target)
        try {
            const job_tx = await boost(event.target)
            const twetchPost = `Beep Boop...🤖 your boost job has been successfully submitted 🦚
            https://whatsonchain.com/tx/${job_tx}`
            await postTwetch(twetchPost, event.call)
        } catch (error) {
            console.log("ERROR", error)
        }

    })

    //test boost
    /* let content_tx_id= "b0bb07ac51359e589b714a520146440e36ed040e1a7ae57e996ad8a5aede7da3";
    let content_tx_index=1;
    let value=0.05;
    await boost({ content_tx_id, content_tx_index, value }) */

    
}

if (require.main === module) {

    start()
  
}