import { Avatar, Box, Typography, Button, IconButton } from '@mui/material';
import { red } from '@mui/material/colors';
import { useAuth } from '../context/AuthContext';
import { IoMdSend } from 'react-icons/io';
import { CiImageOn } from 'react-icons/ci';
import ChatItem from '../components/chat/ChatItem';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/ApiCommunicator';
import toast from 'react-hot-toast';
import ImagePicker from '../components/chat/ImagePicker';
import { useImage } from '../context/ImageContext';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  image?: string;
};

const Chats = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();
  const {
    image,
    imageIsSent,
    setImageIsSent,
    setImageIsSubmited,
    setImage,
  } = useImage();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [openImagePicker, setOpenImagePicker] = useState(false);
  const userName = auth?.user?.name;
  const chatContainerRef = useRef<HTMLDivElement>(null);
  

  const handleSubmit = async () => {
    const value = inputRef.current?.value || '';

    if (!value.trim() && !imageIsSent) return;

    if (inputRef.current) inputRef.current.value = '';

    const userMsg: Message = {
      role: 'user',
      content: value,
      image: imageIsSent ? image : undefined,
    };

    const assistantPlaceholder: Message = {
      role: 'assistant',
      content: '',
    };

    setChatMessages(prev => [...prev, userMsg, assistantPlaceholder]);

    try {
      const chatData = await sendChatRequest(value);
      setChatMessages(chatData.chats);
      setImageIsSubmited(true);
      setImageIsSent(false);  // Reset image flag
      setImage('');           // Reset image URL
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  const deleteChatMessages = () => {
    toast.loading('deleting chats', { id: 'deletechats' });

    deleteUserChats()
      .then(() => {
        toast.success('deleted chats', { id: 'deletechats' });
        setChatMessages([]);
      })
      .catch((err) => {
        console.log(err);
        toast.error('error deleting chats', { id: 'deletechats' });
      });
  };

  useLayoutEffect(() => {
    let didCancel = false;

    if (auth?.isLoggedIn && auth.user) {
      toast.loading('loading chats', { id: 'loadchats' });

      getUserChats()
        .then((data) => {
          if (didCancel) return;
          setChatMessages([...data.chats]);

          if (data.chats.length > 0) {
            toast.success('loaded chats successfully', { id: 'loadchats' });
          } else {
            toast.dismiss('loadchats');
            toast.error('No chats found', { id: 'loadchats' });
          }
        })
        .catch((err) => {
          if (didCancel) return;
          console.log(err);
          toast.error('loading failed', { id: 'loadchats' });
        });
    }

    return () => {
      didCancel = true;
      toast.dismiss('loadchats');
    };
  }, [auth?.isLoggedIn, auth?.user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleImagePicker = () => {
    setOpenImagePicker(prev => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        width: '100%',
        mt: 1,
        mb: 7,
        gap: 3,
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: { md: 'flex', xs: 'none', sm: 'none' },
          flex: 0.2,
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: '80vh',
            bgcolor: 'rgb(17,29,38)',
            borderRadius: 5,
            flexDirection: 'column',
            mb: 5,
            ml: 2,
          }}
        >
          <Avatar
            sx={{
              mx: 'auto',
              my: 2,
              bgcolor: 'white',
              color: 'black',
              fontWeight: 700,
            }}
          >
            {userName?.split(' ')[1]
              ? userName?.split(' ')[1][0]
              : userName?.[0]}
          </Avatar>
          <Typography sx={{ textAlign: 'center', fontFamily: 'work sans' }}>
            You are talking to a chat bot
          </Typography>
          <Typography
            sx={{ mx: 'auto', fontFamily: 'work sans', my: 4, p: 3 }}
          >
            Ask anything but avoid sharing personal information
          </Typography>
          <Button
            onClick={deleteChatMessages}
            sx={{
              width: '200px',
              my: 'auto',
              color: 'white',
              fontWeight: 700,
              borderRadius: 3,
              mx: 'auto',
              bgcolor: red[300],
              ':hover': {
                bgcolor: red[600],
              },
            }}
          >
            Clear conversation
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: 'column',
          px: 3,
          mt: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: '40px',
            color: 'white',
            mb: 2,
            mx: 'auto',
          }}
        >
          Model - DeepSeek R-1
        </Typography>

        <Box
          ref={chatContainerRef}
          sx={{
            width: '90%',
            height: '55vh',
            borderRadius: 3,
            mx: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            scrollBehavior: 'smooth',
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem
              key={index}
              content={chat.content}
              role={chat.role}
              isLoading={chat.role === 'assistant' && chat.content.trim() === ''}
            />
          ))}
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '1000px',
            minWidth: '300px',
            p: 2,
            borderRadius: 4,
            bgcolor: 'rgb(17,27,39)',
            display: 'flex',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              padding: '10px',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontSize: '20px',
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: 'white' }}>
            <IoMdSend />
          </IconButton>
          <IconButton
            onClick={handleImagePicker}
            sx={{ position: 'relative', color: 'white' }}
          >
            <CiImageOn />
          </IconButton>
          {imageIsSent && (
            <Box
              sx={{
                bgcolor: 'transparent',
                border: '3px solid rgba(255,255,255,0.2)',
                height: '50px',
                width: '50px',
                opacity: 0.8,
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                my: '20px',
              }}
            >
              <img
                src={image}
                alt="Selected"
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {openImagePicker && (
        <ImagePicker
          setOpenImagePicker={setOpenImagePicker}
          handleSend={() => {setImageIsSent(true); setOpenImagePicker(false)}}
          ref={imageRef}
        />
      )}
    </Box>
  );
};

export default Chats;