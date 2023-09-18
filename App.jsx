/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Asset} from 'expo-asset';
import {manipulateAsync} from 'expo-image-manipulator';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const invoice = [
    {
      id: 1,
      key: 'Recipient',
      value: 'Kolawole Emmauel',
    },

    {
      id: 2,
      key: 'Earrings',
      value: '$40.00',
    },
    {
      id: 3,
      value: 'necklace',
      key: '$100.00',
    },
    {
      id: 4,
      key: 'Total',
      value: '$140.00',
    },
  ];
  //TO GET ASSET FROM DEVICE MEMORY
  const copyFromAssets = async asset => {
    try {
      const [{localUri}] = await Asset.loadAsync(asset);
      return localUri;
    } catch (error) {
      console.log(error);
    }
  };
  //CONVERT LocalUri to base64
  const processLocalImage = async imageUri => {
    try {
      const uriParts = imageUri.split('.');
      const formatPart = uriParts[uriParts.length - 1];
      let format;

      if (formatPart.includes('png')) {
        format = 'png';
      } else if (formatPart.includes('jpg') || formatPart.includes('jpeg')) {
        format = 'jpeg';
      }

      const {base64} = await manipulateAsync(imageUri, [], {
        format: format || 'png',
        base64: true,
      });

      return `data:image/${format};base64,${base64}`;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const htmlContent = async () => {
    try {
      const asset = require('./src/assets/logo.png');
      let src = await copyFromAssets(asset);
      src = await processLocalImage(src);
      return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pdf Content</title>
        <style>
            body {
              font-size: 16px;
              color: rgb(255, 196, 0);
            
            }

            h1 {
              text-align: center;
            }
            .imgContainer {
              display: flex;
              flex-direction: row;
              align-items: center;
            }
            .userImage {
              width: 50px;
              height: 50px;
              
        }
              .list {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            justify-content: space-between;
          }

          .key {
            font-family: "Inter", sans-serif;
            font-weight: 600;
            color: #000;
            font-size: 12px;
            line-height: 1.2;
            width: 40%;
          }

          .value {
            font-family: "Inter", sans-serif;
            font-weight: 600;
            color: #000;
            font-size: 12px;
            line-height: 1.2;
            text-transform: capitalize;
            width:60%;
            flex-wrap: wrap;
          }
        </style>
    </head>
    <body>
    <div class="imgContainer">
            <img
              src=${src}
              alt="logo"
              class="userImage"
            />

            <h1>Treasury Jewels</h1>
          </div>
        
        <div class="confirmationBox_content">
        ${invoice
          .map(
            el =>
              `<div
                  class="list"
                  key=${el.id}
                 
                >
                  <p class="key">${el.key}</p>
                  <p class="key">${el.value}</p>
                </div>`,
          )
          .join('')}
    </div>
    </body>
    </html>
`;
    } catch (error) {
      console.log('pdf generation error', error);
    }
  };

  const createPDF = async () => {
    try {
      let PDFOptions = {
        html: await htmlContent(),
        fileName: 'file',
        directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
      };
      let file = await RNHTMLtoPDF.convert(PDFOptions);
      console.log('pdf', file.filePath);
      if (!file.filePath) return;
      alert(file.filePath);
    } catch (error) {
      console.log('Failed to generate pdf', error.message);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={[
            {
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            },
            styles.container,
          ]}>
          <TouchableOpacity style={styles.button} onPress={createPDF}>
            <Text>Create PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
  },
  button: {
    padding: 16,
    backgroundColor: '#E9EBED',
    borderColor: '#f4f5f6',
    borderWidth: 1,
  },
});
