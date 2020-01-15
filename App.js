import Game from './Game';
import LoginScreen from './LoginScreen';
import MainMenu from './MainMenu';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const MainNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Game: { screen: Game },
  MainMenu: { screen: MainMenu },
});

const App = createAppContainer(MainNavigator);

export default App;
