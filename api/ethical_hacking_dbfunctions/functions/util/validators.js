const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
  };
  
  const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
  };

  exports.validateResponseData = (data) => {
    let errors = [];

    if(isEmpty(data.title)) {
      errors.title = 'Must not be empty';
    }
    if(isEmpty(data.content)) {
      errors.content = 'Must not be empty';
    }
    if(isEmpty(data.postId)) {
      errors.postId = 'Must not be empty';
    }
    if(isEmpty(data.creator)) {
      errors.creator = 'Invalid uid';
    }


    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  }

  exports.validateRResponseData = (data) => {
    let errors = [];

    if(isEmpty(data.title)) {
      errors.title = 'Must not be empty';
    }
    if(isEmpty(data.content)) {
      errors.content = 'Must not be empty';
    }
    if(isEmpty(data.rresponseId)) {
      errors.rresponseId = 'Must not be empty';
    }
    if(isEmpty(data.creator)) {
      errors.creator = 'Invalid uid';
    }


    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  }
  
  exports.validateSignupData = (data) => {
    let errors = {};
  
    if (isEmpty(data.email)) {
      errors.email = 'Must not be empty';
    } else if (!isEmail(data.email)) {
      errors.email = 'Must be a valid email address';
    }
  
    if (isEmpty(data.password)) {
      errors.confirmPassword = 'Must not be empty';
      errors.password = 'Must not be empty';
    }
    else if(data.password.length <= 6) {
      errors.password = 'Must be al least 6 digits';
    }
    if (data.password !== data.confirmPassword)
      errors.confirmPassword = 'Passwords must match';
    if (isEmpty(data.userNickName)) errors.userNickName = 'Must not be empty';
    if (isEmpty(data.invitationId)) errors.invitationId = 'Must not be empty';
  
    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  };
  
  exports.validateLoginData = (data) => {
    let errors = {};
  
    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';
  
    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  };

  exports.validatePostData = (data) => {
    let errors = {};

    if(isEmpty(data.title)) errors.title = 'Must not be empty';
    if(isEmpty(data.content)) errors.content = 'Must not be empty';
    if(data.prize <= 0) errors.prize = 'Must not be empty';
    if(isEmpty(data.tags)) errors.tags = 'Must not be empty';
    if(isEmpty(data.website)) errors.website = 'Must not be empty';

    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  }

  exports.validateEditResponseData = (data) => {
    let errors = {};
    
    
    if(isEmpty(data.title)) errors.title = 'Must not be empty';
    if(isEmpty(data.content)) errors.content = 'Must not be empty';

    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };    
  }

  exports.validateEditPostData = (data) => {
    let errors = {};
    
    
    if(isEmpty(data.title)) errors.title = 'Must not be empty';
    if(isEmpty(data.content)) errors.content = 'Must not be empty';
    if(isEmpty(data.website)) errors.website = 'Must not be empty';

    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };    
  }

  exports.validateMessageData = (newMessageDetails, newConversationDetails) => {
    let errors = {};

    if(newConversationDetails.participants.length <= 0) errors.participants = 'Must not be empty';
    if(isEmpty(newConversationDetails.lastMessage)) errors.lastMessage = 'Must not be empty';

    if(isEmpty(newMessageDetails.message)) errors.message = 'Must not be empty';
    if(isEmpty(newMessageDetails.sender)) errors.sender = 'Must not be empty';


    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  }

  exports.validateReward = (data) => {
    let errors = {};

    if(data.coins <= 0) errors.coins = 'Must not be empty';
    if(isEmpty(data.root)) errors.root = 'Must not be empty';
    if(isEmpty(data.responseId)) errors.responseId = 'Must not be empty';

    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  }

  exports.validateNewMessageData = (newMessageDetails) => {
    let errors = {};
    if(isEmpty(newMessageDetails.message)) errors.message = 'Must not be empty';
    if(isEmpty(newMessageDetails.sender)) errors.sender = 'Must not be empty';


    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    }
  }

  exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if(data.bio && !isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(data.likesCount >= 0) userDetails.likesCount = data.likesCount;


    return userDetails;

  };