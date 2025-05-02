// // components/CommunityMessageList.jsx
// import React, { useRef, useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
// import './CommunityMessageList.scss'; 

// const CommunityMessageList = ({ messages, currentUserId, userProfiles, isDarkMode }) => {
//   const messagesEndRef = useRef(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const formatTime = (isoString) => {
//     try {
//       return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch {
//       return '';
//     }
//   };
//   const handleEdit = (message) => {
//     setEditingId(message.id);
//     setEditText(message.text);
//   };

//   const saveEdit = async (id) => {
//     try {
//       setError(null);
//       const success = await onEditMessage(id, editText);
//       if (success) {
//         setEditingId(null);
//       }
//     } catch (err) {
//       console.error('Ошибка при редактировании сообщения:', err);
//       setError('Не удалось отредактировать сообщение');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
//       return;
//     }

//     try {
//       setError(null);
//       await onDeleteMessage(id);
//     } catch (err) {
//       console.error('Ошибка при удалении сообщения:', err);
//       setError('Не удалось удалить сообщение');
//     }
//   };

//   return (
//     <div className={`community-message-list ${isDarkMode ? 'dark' : 'light'}`}>
//       {messages?.length === 0 ? (
//         <div className="no-messages">Нет сообщений в сообществе</div>
//       ) : (
//         messages.map((message) => {
//           const isCurrentUser = message.senderId === currentUserId;
//           const profile = userProfiles?.[message.senderId] || {};
//           const avatarUrl = profile.avatarUrl || '/default-avatar.png';
//           const nickname = profile.nickname || 'Пользователь';
//           const isEditing = editingId === message.id;

//           return (
//             <div
//               key={message.id}
//               className={`message-item ${isCurrentUser ? 'message-outgoing' : 'message-incoming'}`}
//             >
//               {!isCurrentUser && <img src={avatarUrl} alt="avatar" className="avatar" />}

//               <div className="message-bubble">
//                 {!isCurrentUser && <div className="nickname">{nickname}</div>}

//                 {isEditing ? (
//                   <div className="message-edit">
//                     <textarea
//                       value={editText}
//                       onChange={(e) => setEditText(e.target.value)}
//                       className={`edit-textarea ${isDarkMode ? 'dark' : 'light'}`}
//                     />
//                     <div className="edit-actions">
//                       <button
//                         className={`btn btn-sm btn-primary ${isDarkMode ? 'dark' : 'light'}`}
//                         onClick={() => saveEdit(message.id)}
//                       >
//                         Сохранить
//                       </button>
//                       <button
//                         className={`btn btn-sm btn-secondary ${isDarkMode ? 'dark' : 'light'}`}
//                         onClick={() => setEditingId(null)}
//                       >
//                         Отмена
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className='message-text'>{message.text} 
//                     <span className="message-time">
//                       {isCurrentUser && (
//                         <div className="message-actions">
//                           <button onClick={() => handleEdit(message)}>
//                             <FontAwesomeIcon icon={faPencilAlt} />
//                           </button>
//                           <button onClick={() => handleDelete(message.id)}>
//                             <FontAwesomeIcon icon={faTrashAlt} />
//                           </button>
//                         </div>
//                       )}
//                       {formatTime(message.timestamp)}
//                     </span>
//                     </div>
                    
//                   </>
//                 )}
//               </div>

//               {isCurrentUser && <img src={avatarUrl} alt="avatar" className="avatar" />}
//             </div>
//           );
//         })
//       )}
//       <div ref={messagesEndRef} />
//     </div>
//   );
// };

// export default CommunityMessageList;

import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './CommunityMessageList.scss';

const CommunityMessageList = ({ messages, currentUserId, userProfiles, isDarkMode, onEditMessage, onDeleteMessage }) => {
  const messagesEndRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleEdit = (message) => {
    setEditingId(message.id);
    setEditText(message.text);
  };

  const saveEdit = async (id) => {
    try {
      setError(null);
      const success = await onEditMessage(id, editText);
      if (success) {
        setEditingId(null);
      }
    } catch (err) {
      console.error('Ошибка при редактировании сообщения:', err);
      setError('Не удалось отредактировать сообщение');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить это сообщение?')) return;

    try {
      setError(null);
      await onDeleteMessage(id);
    } catch (err) {
      console.error('Ошибка при удалении сообщения:', err);
      setError('Не удалось удалить сообщение');
    }
  };

  return (
    <div className={`tg-message-list ${isDarkMode ? 'dark' : 'light'}`}>
      {messages?.length === 0 ? (
        <div className="tg-no-messages">Нет сообщений в сообществе</div>
      ) : (
        messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId;
          const profile = userProfiles?.[message.senderId] || {};
          const avatarUrl = profile.avatarUrl || '/default-avatar.png';
          const nickname = profile.nickname || 'Пользователь';
          const isEditing = editingId === message.id;

          return (
            <div key={message.id} className={`tg-message ${isCurrentUser ? 'outgoing' : 'incoming'}`}>
              {!isCurrentUser  && <img src={avatarUrl} alt="avatar" className="tg-avatar" />}

              <div className="tg-bubble">
                {!isCurrentUser && <div className="tg-nickname">{nickname}</div>}

                {isEditing ? (
                  <div className="tg-edit-container">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className={`tg-edit-textarea ${isDarkMode ? 'dark' : 'light'}`}
                    />
                    <div className="tg-edit-actions">
                      <button className={`tg-btn tg-btn-save ${isDarkMode ? 'dark' : 'light'}`} onClick={() => saveEdit(message.id)}>
                        Сохранить
                      </button>
                      <button className={`tg-btn tg-btn-cancel ${isDarkMode ? 'dark' : 'light'}`} onClick={() => setEditingId(null)}>
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="tg-text-wrapper">
                    <div className="tg-text">{message.text}</div>
                    <span className="tg-time">{formatTime(message.timestamp)}</span>
                    {isCurrentUser && (
                      <div className="tg-actions">
                        <button onClick={() => handleEdit(message)}>
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button onClick={() => handleDelete(message.id)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default CommunityMessageList;
