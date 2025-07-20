import { Avatar, Box, Typography } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {  coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism'


// Extract blocks (split on backticks for code + text)
function extractCodeFromString(message: string): string[] {
  // Split on triple backticks (```)
  return message.split(/`{3}/);
}

const CodeLang = ( code: string) => {
  const firstWord = code.trim().split(/\s+/)[0];

  return `${firstWord}`;
};

// Check if a block is likely code
function isCodeBlock(block: string): boolean {
  // Check for common code patterns
  return /function|const|let|var|=>|new Function|return|console\.log|yield/.test(block);
}

// Clean response: remove rubbish chars, normalize spaces
function cleanResponse(message: string): string {
  const blocks = extractCodeFromString(message);

  // Filter out code blocks
  const textOnly = blocks
    .filter(block => !isCodeBlock(block))
    .join(" ");

  // Remove unwanted characters (keep Arabic, English letters, numbers, spaces)
  let cleaned: string = textOnly.replace(/[^ء-يa-zA-Z0-9\s?!']/g, "");

  // Normalize multiple spaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}


const ChatItem = ({
  content,
  role,
  image,
  isLoading = false,
}: {
  content: string;
  role: "user" | "assistant" | "system";
  image?: string;
  isLoading?: boolean;
}) => {
  const auth = useAuth();
  const userName = auth?.user?.name;
  const messageBlocks = extractCodeFromString(content);

  const renderContent = () => {
    if ((messageBlocks.length === 0 || !content.trim()) && isLoading) {
      return (
        <Box
          sx={{
            bgcolor: "gray",
            borderRadius: "50px",
            height: "30px",
            width: "30px",
            mt: "10px",
            animation: "pulse 1s infinite ease-in-out",
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.2)', opacity: 0.3 },
              '100%': { transform: 'scale(1)', opacity: 1 },
            }
          }}
        />
      );
    }

    return messageBlocks.map((block, index) =>
      isCodeBlock(block) ? (
        <SyntaxHighlighter
          style={coldarkDark}
          key={index}
          language={CodeLang(block)}
          wrapLines = {true}
          wrapLongLines = {true}
        >
          {block}
        </SyntaxHighlighter>
      ) : (
        <Typography
          key={index}
          sx={{ fontSize: "20px", overflowWrap: "anywhere",  }}
        >
          {cleanResponse(block)}
        </Typography>
      )
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: role === "assistant" ? "#0004d5612" : "#004d56",
        my: 2,
        gap: 2,
      }}
    >
      <Avatar
        sx={{
          ml: "0",
          bgcolor: role === "assistant" ? undefined : "black",
          color: role === "assistant" ? undefined : "white",
        }}
      >
        {role === "assistant" ? (
          <img src="d.png" alt="openai" width="50px" />
        ) : (
          userName?.split(" ")[1]?.[0] || userName?.[0]
        )}
      </Avatar>

      <Box>
        {renderContent()}
        {image && (
          <Box
            sx={{
              bgcolor: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              height: "150px",
              width: "150px",
              opacity: 0.8,
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              my: "20px"
            }}
          >
            <img
              src="d.png"
              alt="User sent"
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatItem