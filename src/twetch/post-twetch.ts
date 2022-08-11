import config from './config'
import TwetchWallet from './twetch-wallet'

const wallet = new TwetchWallet(config.metasync.seed, config.metasync.paymail)

const postTwetch = async (content: string, replyTx?: string): Promise<void> => {
	try {
		const result = await wallet._run_legacy_action({
			action: 'twetch/post@0.0.1',
			payParams: {
				tweetFromTwetch: true,
				hideTweetFromTwetchLink: true
			},
			args: {
				bContent: content,
				bFilename: `twetch_twtext_${new Date().getTime()}.txt`,
				type: 'post',
				mapReply: replyTx || 'null',
				mapTwdata: 'null'
			}
		})
		console.log(result)
	} catch (e) {
		console.log(e)
	}
}

export default postTwetch