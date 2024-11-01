import { Image } from 'expo-image';
import { Button, StyleSheet, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Directory, File, Paths } from 'expo-file-system/next';
const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const imageURL = 'https://picsum.photos/seed/696/3000/2000';

export default function TabTwoScreen() {
  const [permission, requestPermission] = MediaLibrary.usePermissions({
    writeOnly: true,
  });

  const handlePressDownload = async () => {
    let accessPrivileges = permission?.accessPrivileges;

    if (
      (permission?.canAskAgain && permission.accessPrivileges !== 'all') ||
      !permission
    ) {
      const result = await requestPermission();
      accessPrivileges = result.accessPrivileges;
    }

    if (accessPrivileges === 'none' || !accessPrivileges) {
      return;
    }

    const destination = new Directory(Paths.cache, 'images');

    try {
      if (!destination.exists) destination.create();

      const downloadFile = await File.downloadFileAsync(imageURL, destination);

      try {
        const asset = await MediaLibrary.createAssetAsync(downloadFile.uri);

        if (accessPrivileges === 'all') {
          const albumInfo = await MediaLibrary.getAlbumAsync('PackPack');
          if (!albumInfo) {
            await MediaLibrary.createAlbumAsync('PackPack', asset, false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], albumInfo, false);
          }
        }
      } catch (e) {
        downloadFile.delete();
        console.error(e);
      }
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={imageURL}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />

      <Button title="Press me" onPress={handlePressDownload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 200,
    width: '100%',
    backgroundColor: '#0553',
  },
});
