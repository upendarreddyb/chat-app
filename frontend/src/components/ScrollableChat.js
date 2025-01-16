import { Avatar } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  // Helper to format dates
  const formatDate = (date) => {
    const messageDate = new Date(date).toLocaleDateString();
    const todayDate = new Date().toLocaleDateString();

    if (messageDate === todayDate) return "TODAY";
    return messageDate;
  };

  // Track the last displayed date
  let lastDate = null;

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const messageDate = formatDate(m.createdAt);
          const showDateHeader = messageDate !== lastDate;
          if (showDateHeader) lastDate = messageDate;

          return (
            <div key={m._id}>
              {/* Date Header */}
              {showDateHeader && (
                <div
                  style={{
                    textAlign: "center",
                    margin: "10px 0",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "white",
                      padding: "2px 8px",
                      borderRadius: "5px",
                      fontFamily: "sans-serif font",
                    }}
                  >
                    {messageDate}
                  </span>
                </div>
              )}

              {/* Message Bubble */}
              <div style={{ display: "flex" }}>
                {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                  <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                    <Avatar mt="7px" mr={1} size="sm" cursor="pointer" name={m.sender.name} src={m.sender.pic} />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                >
                  {m.content}
                  <span size="sm">
                    <span
                      style={{
                        fontSize: "0.55rem",
                        color: "gray",
                        marginTop: "5px",
                        textAlign: m.sender._id === user._id ? "right" : "left",
                        padding: "5px",
                      }}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                </span>
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
