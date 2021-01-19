import React from 'react';
import Link from 'react-router-dom/Link';
import PropTypes from 'prop-types';
import AddNewPost from '../posts/AddNewPost';
import Notifications from './Notifications';
import Logo from '../../images/icon1.png';

//Redux stuff
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/actions/userActions';

//MUI staff
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

//icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MailIcon from '@material-ui/icons/Mail';

const styles = {
    grow: {
        flexGrow: 1,
      },
      title: {
        display: 'block',
        marginRight: 10,
        color: 'white',
        marginLeft: 5
      },
      usernickname: {
        marginLeft: 5,
      },
      inputRoot: {
        color: 'inherit',
      },
      sectionDesktop: {
        display: 'flex',
      },
      sectionMobile: {
        display: 'none',
      },
      avatar: {
        width: 32,
        height: 32,
        objectFit: 'cover',
        maxWidth: '100%',
        borderRadius: '50%'
      },
      menu: {
        marginTop: 10
      },
      menuitem: {
        width: 200
      },
};


function Navbar (props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    props.logoutUser();
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
        const { 
            classes, 
            user: { 
                authentificated,
                credentials: { 
                  userNickName, 
                  imageUrl, 
                  likesCount,
                  userType,
                  conversations 
                },
                loading,
                notifications
            }
        } = props;

        const renderMenu = (
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            className={classes.menu}
          >
            <MenuItem className={classes.menuitem} onClick={handleMenuClose} component={Link} to="/profile">Profile</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/invites">Invites</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/shop">Shop</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        );
        const addNewPostButton = authentificated && userType >= 2 ? (
          <AddNewPost />
        ) : null;
        const messages = !loading && conversations && props && conversations.length > 0 ? (
          <IconButton aria-label="show new mails" color="inherit" component={Link} to={`/messages/${conversations[0].conversationId}`}>
          <Badge badgeContent={0} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        ) : (
          <IconButton aria-label="show new mails" color="inherit" component={Link} to={`/messages/`}>
          <Badge badgeContent={0} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        );
        const navbar = !loading ? (authentificated && notifications ? (
            <div className={classes.sectionDesktop}>
              {addNewPostButton}
            <IconButton aria-label="show likes" color="inherit">
              <Badge badgeContent={likesCount} color="secondary">
                <FavoriteIcon />
              </Badge>
            </IconButton>
            {messages}
            <Notifications notifications={notifications}/>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <div className="image-wrapper">
                        <img src={imageUrl} alt="profile" className={classes.avatar}></img>
                    </div>
              <Typography className={classes.usernickname} variant="h6" noWrap>
                        {userNickName}
                    </Typography>
              <ArrowDropDownIcon />
            </IconButton>
          </div>
        ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
        )) : (<p>loading...</p>);
        return (
            <div className={classes.grow}>
            <AppBar>
                <Toolbar>
                    <div className="image-wrapper">
                        <img src={Logo} alt="logo" className={classes.avatar}></img>
                    </div>
                    <Typography className={classes.title} variant="h5" noWrap component={Link} to="/">
                        RevMeNow
                    </Typography>
                    <Typography className={classes.title} variant="h6" noWrap component={Link} to="/users">
                        Users
                    </Typography>
                    <Typography className={classes.title} variant="h6" noWrap component={Link} to="/companies">
                        Companies
                    </Typography>
                    <div className={classes.grow} />
                    {navbar}
                </Toolbar>
            </AppBar>
            {renderMenu}
            </div>
        )
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = { logoutUser };

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    user: PropTypes.object,
    classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Navbar))