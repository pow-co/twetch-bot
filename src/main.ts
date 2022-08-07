import { bitsocket } from "./bitsocket"
import { boost } from "./boost"
import { twetchsocket } from "./twetchsocket"

const TWETCH_APP_ID = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"

export async function start() {

    console.log("server started")
    
    //twetchsocket()


    const boostbot = bitsocket(TWETCH_APP_ID)

    boostbot.on('order',(target)=> {

        console.log("new boost order found. target: ", target)

    })

    let content_tx_id= "";
    let content_tx_index=1;
    let value=0.05;
    await boost({ content_tx_id, content_tx_index, value })

    
}

if (require.main === module) {

    start()
  
}