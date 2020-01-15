const React = require("react-native");

const { StyleSheet } = React;

export default {
    main: {
      flex: 1,
      flexDirection: 'column',
    },
    containerView: {
        flex: 1,
    },
    loginScreenContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 40,
        fontWeight: "800",
        position: 'absolute',
        top: 130,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'white',
    },
    loginFormView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#4f9f4c',
        backgroundColor: '#88d186',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    loginButton: {
        backgroundColor: '#36c958',
        height: 100,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 20
    },
    fbLoginButton: {
        height: 45,
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    loading: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      textAlign: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      elevation: 100,
    },
};
