import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput, Button, Tooltip } from 'react-native-paper';
import { useFormContext, Controller } from 'react-hook-form';
import * as DocumentPicker from 'expo-document-picker';
import * as Clipboard from 'expo-clipboard';

export default function RightPanel() {
  const { control, setValue } = useFormContext();

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/markdown', 'text/plain'], // Permite .md y .txt
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const response = await fetch(fileUri);
        const text = await response.text();
        
        setValue('documento.markdown_content', text, { shouldValidate: true, shouldDirty: true });
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Hubo un error al cargar el archivo.');
    }
  };

  const handleCopyPrompt = async () => {
    const prompt = `Actúa como un asistente académico experto. Redacta el contenido de un trabajo de investigación en formato Markdown puro siguiendo estas reglas de jerarquía y formato:
1. Usa "#" ÚNICAMENTE para el título principal del trabajo.
2. Usa "##" para Títulos principales de capítulos (ej. ## Introducción, ## Desarrollo).
3. Usa "###" para Subtítulos (ej. ### 2.1 Tipos).
4. Usa "####" para subtítulos menores (ej. #### Ejemplos).
5. NO incluyas portada, ni índice, ni numeración de páginas. Yo me encargaré de la estructura externa con un formateador.
6. Empieza directamente con el contenido y usa "**negritas**" o "*cursivas*" para destacar conceptos clave.`;

    await Clipboard.setStringAsync(prompt);
    
    // Si estamos en la web nativa, podemos asegurar que el usuario vea un feedback nativo de JS
    if (Platform.OS === 'web') {
        window.alert('¡Prompt copiado! Pégalo en ChatGPT, Claude o Gemini.');
    } else {
        alert('¡Prompt copiado al portapapeles!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Tooltip title="Copia un prompt óptimo para pedirle a ChatGPT/Claude que te redacte el texto.">
          <Button icon="content-copy" mode="text" onPress={handleCopyPrompt}>
            Copiar Prompt para LLM
          </Button>
        </Tooltip>
        <Tooltip title="Sube un archivo .md o .txt ya generado en lugar de escribirlo.">
          <Button icon="upload" mode="outlined" onPress={handleFileUpload}>
            Subir .md
          </Button>
        </Tooltip>
      </View>

      <Controller
        control={control}
        name="documento.markdown_content"
        render={({ field: { onChange, value } }) => (
          <TextInput
            mode="outlined"
            multiline
            placeholder="# Escribe aquí el contenido de tu documento en formato Markdown..."
            value={value}
            onChangeText={onChange}
            style={styles.editor}
            contentStyle={styles.editorContent}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  editor: {
    flex: 1,
  },
  editorContent: {
    height: '100%',
    textAlignVertical: 'top',
    fontFamily: 'monospace',
  }
});
