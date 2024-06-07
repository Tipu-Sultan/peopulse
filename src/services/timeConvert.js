
function calculateTimeDifference(createdAt) {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);

  const timeDifference = Math.abs(currentTime - createdTime);
  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);
  const monthsDifference = Math.floor(daysDifference / 30);
  const yearsDifference = Math.floor(monthsDifference / 12);

  if (yearsDifference > 0) {
    return `${yearsDifference} year${yearsDifference !== 1 ? "s" : ""} ago`;
  } else if (monthsDifference > 0) {
    return `${monthsDifference} month${monthsDifference !== 1 ? "s" : ""
      } ago`;
  } else if (daysDifference > 0) {
    return `${daysDifference} day${daysDifference !== 1 ? "s" : ""} ago`;
  } else if (hoursDifference > 0) {
    return `${hoursDifference} hour${hoursDifference !== 1 ? "s" : ""} ago`;
  } else if (minutesDifference > 0) {
    return `${minutesDifference} minute${minutesDifference !== 1 ? "s" : ""
      } ago`;
  } else {
    return `${secondsDifference} second${secondsDifference !== 1 ? "s" : ""
      } ago`;
  }
}

function formatLastSeen(lastSeenTimestamp) {
  const lastSeenDate = new Date(lastSeenTimestamp);
  const now = new Date();

  const diffTime = now - lastSeenDate;
  const diffHours = diffTime / (1000 * 60 * 60);

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  if (diffHours < 24 && now.getDate() === lastSeenDate.getDate()) {
    // Last seen today
    return `Last seen at ${lastSeenDate.toLocaleString('en-US', options)}`;
  } else if (diffHours < 48 && now.getDate() - lastSeenDate.getDate() === 1) {
    // Last seen yesterday
    return `Last seen yesterday ${lastSeenDate.toLocaleString('en-US', options)}`;
  } else {
    // Last seen more than 48 hours ago
    return `Last seen on ${lastSeenDate.getDate()}/${lastSeenDate.getMonth() + 1}/${lastSeenDate.getFullYear()}`;
  }
}

function formatChatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  // Check if the timestamp is from today
  if (now.toDateString() === date.toDateString()) {
    return date.toLocaleString('en-US', options);
  }

  // Check if the timestamp is from yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    return `Yesterday at ${date.toLocaleString('en-US', options)}`;
  }

  // If the timestamp is older than yesterday, format it as dd/mm/yy at hh:mm:ss AM/PM
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear().toString().slice(-2);
  const time = date.toLocaleString('en-US', options);

  return `${day}/${month}/${year} at ${time}`;
}

module.exports = {
  calculateTimeDifference,
  formatLastSeen,
  formatChatTimestamp
}