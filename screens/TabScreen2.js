// TabScreen2.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { idToken } from "./LoginScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabHeader: {
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  tabHeaderText: {
    marginTop: 50,
    marginLeft: 30,
    fontSize: 24,
    fontWeight: "bold",
  },
  dateTimePicker: {
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: "#A5D699",
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  placeBox: {
    backgroundColor: "#D9D9D9",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  toggleButtonText: {
    color: "white",
    fontSize: 18,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textBox: {
    backgroundColor: "#ffffff",
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  darkgrayText: {
    fontSize: 18,
    color: "#616161",
  },
  lightgrayText: {
    fontSize: 18,
    color: "#F5F5F5",
  },
  whiteText: {
    fontSize: 18,
    color: "#ffffff",
  },
  grayText: {
    fontSize: 18,
    color: "#D9D9D9",
  },
  contentContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  subtitle: {
    fontSize: 18,
    //marginBottom: 10,
    color: "#616161",
  },
  map: {
    flex: 1,
    height: 200,
  },
});

const TabScreen2 = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [selectedPlace, setSelectedPlace] = useState("서울특별시 마포구");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [region, setRegion] = useState(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState([1, 19]);
  const [selectedGender, setSelectedGender] = useState([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [dateButtonSelected, setDateButtonSelected] = useState(false);
  const [startTimeButtonSelected, setStartTimeButtonSelected] = useState(false);
  const [endTimeButtonSelected, setEndTimeButtonSelected] = useState(false);
  const [isPlaceBoxSelected, setIsPlaceBoxSelected] = useState(false);
  const [isDetailedAddressEntered, setIsDetailedAddressEntered] =
    useState(false);

  const handleTogglePress = () => {
    setShowDatePicker(!showDatePicker);
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setDateButtonSelected(true);
    }
  };

  const handleStartTimeChange = (event, date) => {
    setShowStartTimePicker(false);
    if (date) {
      setSelectedStartTime(date);
      setStartTimeButtonSelected(true);
    }
  };

  const handleEndTimeChange = (event, date) => {
    setShowEndTimePicker(false);
    if (date) {
      setSelectedEndTime(date);
      setEndTimeButtonSelected(true);
    }
  };

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    setRegion({
      ...coordinate,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });

    try {
      const address = await Location.reverseGeocodeAsync({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });

      if (address.length > 0) {
        const selectedAddress = `${address[0].region} ${address[0].city} ${address[0].street} ${address[0].name}`;
        setSelectedPlace(selectedAddress);
        setIsPlaceBoxSelected(true);
      }
    } catch (error) {
      console.error("주소를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      });

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    })();
  }, []);

  const handleDetailedAddressChange = (text) => {
    setDetailedAddress(text);
    setIsDetailedAddressEntered(text.length > 0);
  };

  const handleGenderSelection = (gender) => {
    if (selectedGender.includes(gender)) {
      setSelectedGender(selectedGender.filter((item) => item !== gender));
    } else {
      setSelectedGender([...selectedGender, gender]);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const formatTime = (time) => {
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    return `${hours}${minutes}`;
  };

  const formatAge = (age) => {
    const currentYear = new Date().getFullYear();
    return currentYear - age;
  };

  const formatGender = () => {
    if (selectedGender.length === 1) {
      if (selectedGender.includes("남자")) {
        return "m";
      } else if (selectedGender.includes("여자")) {
        return "f";
      }
    }
    return "b";
  };

  const handlePostData = async () => {
    const postData = {
      date: formatDate(selectedDate),
      start_time: formatTime(selectedStartTime),
      end_time: formatTime(selectedEndTime),
      child_age_from: formatAge(selectedAgeRange[0]),
      child_age_to: formatAge(selectedAgeRange[1]),
      rating: 4.2, // 일단은
      address: selectedPlace + " " + detailedAddress,
      email: "test2@example.com", // 일단은
      gender: formatGender(),
    };

    Alert.alert("게시하기", JSON.stringify(postData));
    // 나중엔 삭제할거임~~

    try {
      const response = await fetch("http://pumasi.everdu.com/care/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${idToken}`,
        },
        body: JSON.stringify(postData),
      });
      // 서버 응답 확인
      if (response.ok) {
        const responseData = await response.json();
        console.log("서버 응답:", responseData);
        Alert.alert("게시하기", "게시 성공!");
      } else {
        console.error("서버 응답 오류:", response.status);
        Alert.alert("게시하기", "게시 실패. 서버 응답 오류 발생!");
      }
    } catch (error) {
      console.error("데이터 게시 중 오류:", error);
      Alert.alert("게시하기", "게시 실패. 에러 발생!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderText}>맡기</Text>
      </View>
      <View style={{ marginVertical: 5 }} />
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>맡을 날짜를 선택해주세요</Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              dateButtonSelected ? null : { backgroundColor: "#D9D9D9" },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.toggleButtonText, styles.whiteText]}>
              {selectedDate.toDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              style={styles.dateTimePicker}
              value={selectedDate}
              mode={"date"}
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>맡을 시간을 선택해주세요</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                startTimeButtonSelected ? null : { backgroundColor: "#D9D9D9" },
              ]}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={[styles.toggleButtonText, styles.whiteText]}>
                {selectedStartTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                style={styles.dateTimePicker}
                value={selectedStartTime}
                mode={"time"}
                display="default"
                is24Hour={true}
                onChange={handleStartTimeChange}
              />
            )}
            <View style={styles.textBox}>
              <Text style={styles.darkgrayText}>부터</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                endTimeButtonSelected ? null : { backgroundColor: "#D9D9D9" },
              ]}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={[styles.toggleButtonText, styles.whiteText]}>
                {selectedEndTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                style={styles.dateTimePicker}
                value={selectedEndTime}
                mode={"time"}
                display="default"
                is24Hour={true}
                onChange={handleEndTimeChange}
              />
            )}
            <View style={styles.textBox}>
              <Text style={styles.darkgrayText}>까지</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>맡을 장소를 선택해주세요</Text>

          <View style={{ marginVertical: 10 }} />

          <View
            style={[
              styles.placeBox,
              isPlaceBoxSelected ? { backgroundColor: "#A5D699" } : null,
            ]}
            onPress={handleMapPress}
          >
            <Text style={styles.whiteText}>{selectedPlace}</Text>
          </View>

          <TextInput
            style={[
              styles.placeBox,
              isDetailedAddressEntered ? { backgroundColor: "#A5D699" } : null,
              styles.whiteText,
              { textAlign: "center" },
            ]}
            placeholderTextColor={styles.whiteText.color}
            placeholder="상세 주소 입력"
            value={detailedAddress}
            onChangeText={handleDetailedAddressChange}
          />

          {region && (
            <MapView
              style={styles.map}
              region={region}
              provider="google"
              customMapStyle={[]}
              showsUserLocation={true}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
              />
            </MapView>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>맡을 성별을 선택해주세요</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedGender.includes("남자")
                  ? null
                  : { backgroundColor: "#D9D9D9" },
              ]}
              onPress={() => handleGenderSelection("남자")}
            >
              <Text style={styles.toggleButtonText}>남자</Text>
            </TouchableOpacity>

            <View style={{ marginHorizontal: 10 }} />

            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedGender.includes("여자")
                  ? null
                  : { backgroundColor: "#D9D9D9" },
              ]}
              onPress={() => handleGenderSelection("여자")}
            >
              <Text style={styles.toggleButtonText}>여자</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>맡을 나이를 선택해주세요</Text>
          <View style={styles.toggleContainer}>
            <MultiSlider
              values={selectedAgeRange}
              sliderLength={300}
              onValuesChange={(values) => setSelectedAgeRange(values)}
              min={1}
              max={19}
              step={1}
              allowOverlap
              snapped
              unselectedStyle={{
                backgroundColor: "#D9D9D9", // 선택되지 않은 부분의 배경 색상
              }}
              selectedStyle={{
                backgroundColor: "#A5D699", // 선택된 부분의 배경 색상
              }}
              markerStyle={{
                backgroundColor: "#A5D699", // 마커의 배경 색상
              }}
              pressedMarkerStyle={{
                backgroundColor: "#D9D9D9", // 마커가 눌렸을 때의 배경 색상
              }}
            />
          </View>

          <View style={styles.toggleContainer}>
            <View style={styles.textBox}>
              <Text style={styles.darkgrayText}>
                {selectedAgeRange[0]}세 부터
              </Text>
            </View>

            <View style={styles.textBox}>
              <Text style={styles.darkgrayText}>
                {selectedAgeRange[1]}세 까지
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#A5D699",
            padding: 15,
            borderRadius: 10,
            margin: 20,
            marginLeft: 40,
            marginRight: 40,
            alignItems: "center",
          }}
          onPress={handlePostData}
        >
          <Text style={styles.whiteText}>게시하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TabScreen2;
