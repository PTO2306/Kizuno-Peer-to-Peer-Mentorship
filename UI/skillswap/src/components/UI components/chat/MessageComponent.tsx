import { Paper, Typography } from "@mui/material";

interface MessageProps {
    text: string;
    isSender: boolean;
    timestamp: string;
    senderName?: string 
}



const MessageComponent = ({ text, isSender, timestamp, senderName }: MessageProps) => {

    const alignmentClass = isSender ? "justify-end" : "justify-start";

    const bubbleClass = isSender
        ? "bg-blue-600 text-white rounded-br-none"
        : "bg-gray-200 text-gray-800 rounded-bl-none";

    const timestampClass = isSender ? "text-blue-100" : "text-gray-600";

    return (
        <div className={`flex w-full mb-4 ${alignmentClass}`}>
            <Paper
                className={`${bubbleClass} flex flex-col max-w-[90%] sm:max-w-[75%] p-3 md:p-4`}
            >
                {senderName && !isSender && (
                    <div className={`flex justify-start text-gray-600 mb-1 -mt-1`}>
                        <Typography variant="caption" className="font-semibold">{senderName}</Typography>
                    </div>
                )}

                {/* Message Content */}
                <div className="flex-1 overflow-auto">
                    <Typography variant="body1" className="whitespace-pre-wrap">
                        {text}
                    </Typography>
                </div>

                {/* Timestamp */}
                <div className={`flex text-right mt-1 justify-end ${timestampClass}`}>
                    <Typography variant="caption">{timestamp}</Typography>
                </div>
            </Paper>
        </div>
    );
};


export default MessageComponent