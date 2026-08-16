import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { Appbar, useTheme, Surface, Button, ActivityIndicator, Snackbar, FAB } from 'react-native-paper';
import { useForm, FormProvider } from 'react-hook-form';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://docformatter-api.onrender.com/generate";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || "tu_clave_secreta_aqui"; 

export default function Index() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const isDesktop = width > 800;

  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Inicializar React Hook Form con valores por defecto
  const methods = useForm({
    defaultValues: {
      portada: {
        institucion: '',
        titulo: '',
        unidad_curricular: '',
        docente: '',
        fecha_lugar: '',
        integrantes: [{ nombre: '', cedula: '' }],
      },
      documento: {
        markdown_content: '',
      },
      format: {
        mode: 'preset',
        preset: 'apa',
        indice_general: false,
        custom: {
          margenes: {
            superior_cm: "4.0",
            inferior_cm: "3.0",
            izquierdo_cm: "4.0",
            derecho_cm: "3.0",
          },
          cuerpo_texto: {
            familia: 'Arial',
            interlineado: "1.5",
          }
        }
      }
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Limpiar integrantes vacíos
      data.portada.integrantes = data.portada.integrantes.filter(
        (i: any) => i.nombre.trim() !== ''
      );
      if (data.portada.integrantes.length === 0) {
        data.portada.integrantes = [{ nombre: 'Autor', cedula: 'N/A' }];
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Error API: ${response.status}`);
      }

      const blob = await response.blob();
      
      const tituloLimpio = data.portada.titulo.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "_") || "Documento";
      const filename = `${tituloLimpio}.docx`;

      if (Platform.OS === 'web') {
        // Descarga nativa para navegadores Web
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setSnackbarMessage(`¡Documento descargado con éxito: ${filename}!`);
      } else {
        // Descarga para Móviles Nativos (iOS/Android)
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result?.toString().split(',')[1];
          if (base64data) {
            const fileUri = `${FileSystem.documentDirectory}${filename}`;
            await FileSystem.writeAsStringAsync(fileUri, base64data, {
              encoding: FileSystem.EncodingType.Base64,
            });
            await Sharing.shareAsync(fileUri);
            setSnackbarMessage('¡Documento listo para compartir!');
          }
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error al generar el documento. Verifica los datos y la API Key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header elevated>
          <Appbar.Content title="DocFormatter" />
          {/* Aquí iría un botón para ir a Settings y poner el API Key, por ahora lo ocultamos
          <Appbar.Action icon="cog" onPress={() => {}} /> 
          */}
        </Appbar.Header>

        <View style={[styles.mainContent, isDesktop ? styles.row : styles.column]}>
          
          {/* Panel Izquierdo: Configuración */}
          <Surface style={[styles.panel, isDesktop ? styles.leftPanel : styles.fullPanel]} elevation={1}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <LeftPanel />
            </ScrollView>
          </Surface>

          {/* Panel Derecho: Editor */}
          <Surface style={[styles.panel, isDesktop ? styles.rightPanel : styles.fullPanel]} elevation={1}>
             <View style={styles.scrollContent}>
              <RightPanel />
            </View>
          </Surface>

        </View>

        {/* FAB flotante para generar desde cualquier lugar de la pantalla */}
        <FAB
          icon="file-word-box"
          label={loading ? "Generando..." : "Generar Documento"}
          loading={loading}
          disabled={loading}
          style={styles.fab}
          onPress={methods.handleSubmit(onSubmit)}
        />

        <Snackbar
          visible={!!snackbarMessage}
          onDismiss={() => setSnackbarMessage('')}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>

      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // Espacio extra para el FAB flotante
    gap: 16,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  panel: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  leftPanel: {
    flex: 1,
    maxWidth: 500, // En escritorio, el panel izquierdo tiene max-width
  },
  rightPanel: {
    flex: 2, // El editor ocupa más espacio visualmente
  },
  fullPanel: {
    flex: 1,
    minHeight: 400,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
