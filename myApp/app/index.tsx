import { Redirect } from "expo-router";

export default function Index() {
<<<<<<< HEAD
  return <Redirect href="/login" />;
=======
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>hello</Text>
      <Link href="/sample/exx">Vanakam</Link>
      <Link href="/login">Login</Link>
    </View>
  );
>>>>>>> c7d0d3ffca8f29b86bf80c3b4cb33b9687350298
}
