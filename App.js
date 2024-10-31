import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const [dogImage, setDogImage] = useState('');
  const [dogInfo, setDogInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDog = () => {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": "DEMO-API-KEY", 
    };

    fetch("https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1", {
      method: 'GET',
      headers: headers
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na resposta da API: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        console.log('Resposta da API:', result); // Log para inspecionar a resposta da API

        if (result.length > 0 && result[0].breeds && result[0].breeds.length > 0) {
          const dogData = result[0];
          const breed = dogData.breeds[0];

          setDogImage(dogData.url || ''); // Verificar a validade de uma URL
          setDogInfo({
            name: breed.name || 'Raça desconhecida',
            temperament: breed.temperament || 'Temperamento não disponível',
            lifeSpan: breed.life_span || 'Tempo de vida não disponível',
          });
          setErrorMessage('');
        } else {
          setDogInfo({ message: 'Informações da raça não disponíveis.' });
          setDogImage('');
        }
      })
      .catch(error => {
        console.log('Error:', error);
        setErrorMessage('Erro ao buscar dados da API.');
      });
  };

  useEffect(() => {
    fetchDog();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Random Dog Image</Text>
      <TouchableOpacity style={styles.button} onPress={fetchDog}>
        <Text style={styles.buttonText}>Get a New Dog!</Text>
      </TouchableOpacity>
      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : (
        <>
          {dogImage !== '' && (
            <Image source={{ uri: dogImage }} style={styles.image} />
          )}
          <View style={styles.infoContainer}>
            {dogInfo.name ? (
              <>
                <Text style={styles.info}><Text style={styles.label}>Raça:</Text> {dogInfo.name}</Text>
                <Text style={styles.info}><Text style={styles.label}>Temperamento:</Text> {dogInfo.temperament}</Text>
                <Text style={styles.info}><Text style={styles.label}>Tempo de Vida:</Text> {dogInfo.lifeSpan}</Text>
              </>
            ) : (
              <Text>{dogInfo.message || 'Loading...'}</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2F1E7',
    padding: 20,
  },

  title: {
    fontSize: 24,
    color: 'white',
    backgroundColor: '#243642',
    padding: 15,
    textAlign: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    maxWidth: 600,
    marginBottom: 20,
  },

  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },

  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },

  button: {
    backgroundColor: '#387478', 
    paddingVertical: 12,        
    paddingHorizontal: 20,      
    borderRadius: 8,           
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3,         
    shadowRadius: 4,            
    elevation: 5,               
  },

  buttonText: {
    color: 'white',            
    fontSize: 18,               
    fontWeight: 'bold',         
    textAlign: 'center',
  },

  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  info: {
    fontSize: 16,
    marginBottom: 10,
  },

  label: {
    fontWeight: 'bold',
  },
});
