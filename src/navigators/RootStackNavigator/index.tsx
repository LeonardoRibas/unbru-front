import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import ActivityIndicatorBox from "../../components/ActivityIndicatorBox";
import Header from "../../components/Header";
import DayIndexContextProvider from "../../context/DayIndexContext";
import OnBoarding from "../../pages/OnBoarding";
import Settings from "../../pages/Settings";
import api from "../../services/api";
import { getFormatedDate } from "../../utils/date";
import BottomTabNavigator from "../BottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function RootStackNavigator(): React.ReactElement {
    const [weekMenu, setWeekMenu] = useState<WeekMenu>();
    const [dayIndex, setDayIndex] = useState(0);

    useEffect(() => {
        api.get("/menu")
            .then((res) => {
                setWeekMenu(res.data);
                console.log(res.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);
    return (
        <DayIndexContextProvider value={{ dayIndex, setDayIndex }}>
            <Stack.Navigator>
                <Stack.Screen
                    name="OnBoarding"
                    component={OnBoarding}
                    options={{ headerShown: false }}
                />
                {weekMenu ? (
                    <Stack.Screen
                        name="Menu"
                        options={{
                            header: (props) => (
                                <Header day={getFormatedDate(weekMenu[dayIndex].date)} {...props} />
                            ),
                        }}
                    >
                        {(props) => <BottomTabNavigator {...props} dayMenu={weekMenu[dayIndex]} />}
                    </Stack.Screen>
                ) : (
                    <Stack.Screen name="Loading" component={ActivityIndicatorBox} />
                )}
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        title: "Configurações",
                    }}
                />
            </Stack.Navigator>
        </DayIndexContextProvider>
    );
}
