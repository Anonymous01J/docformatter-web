import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, List, Switch, Text, IconButton, Button, Tooltip, Divider, Portal, Dialog, Paragraph, Menu, TouchableRipple } from 'react-native-paper';
import { useFormContext, useFieldArray, Controller, useWatch } from 'react-hook-form';

const FONTS = ["Arial", "Times New Roman", "Calibri", "Courier New", "Verdana", "Georgia", "Tahoma", "Trebuchet MS", "Comic Sans MS"];

export default function LeftPanel() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'portada.integrantes',
  });

  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [fontMenuVisible, setFontMenuVisible] = React.useState(false);
  const formatMode = useWatch({ control, name: 'format.mode' });
  const formatPreset = useWatch({ control, name: 'format.preset' });

  return (
    <List.AccordionGroup>
      <List.Accordion title="1. Portada" id="1" left={props => <List.Icon {...props} icon="book-open-page-variant" />}>
        <View style={styles.section}>
          <Controller
            control={control}
            name="portada.institucion"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Institución"
                mode="outlined"
                placeholder="Ej. Universidad Central de Venezuela"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
          <Controller
            control={control}
            name="portada.titulo"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Título del Documento"
                mode="outlined"
                placeholder="Ej. Trabajo Especial de Grado"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
          <Controller
            control={control}
            name="portada.unidad_curricular"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Unidad Curricular (Opcional)"
                mode="outlined"
                placeholder="Ej. Física II"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
          <Controller
            control={control}
            name="portada.docente"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Docente (Opcional)"
                mode="outlined"
                placeholder="Ej. Prof. María Pérez"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
          <Controller
            control={control}
            name="portada.fecha_lugar"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Fecha y Lugar"
                mode="outlined"
                placeholder="Ej. Junio del 2026 – Barquisimeto, Venezuela"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
        </View>
      </List.Accordion>

      <Divider />

      <List.Accordion title="2. Integrantes" id="2" left={props => <List.Icon {...props} icon="account-group" />}>
        <View style={styles.section}>
          {fields.map((item, index) => (
            <View key={item.id} style={styles.integranteRow}>
              <View style={styles.integranteInputs}>
                <Controller
                  control={control}
                  name={`portada.integrantes.${index}.nombre`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Nombre y Apellido"
                      mode="outlined"
                      dense
                      placeholder="Ej. Juan Pérez"
                      value={value}
                      onChangeText={onChange}
                      style={[styles.input, { flex: 2 }]}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`portada.integrantes.${index}.cedula`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Cédula"
                      mode="outlined"
                      dense
                      placeholder="Ej. 12345678"
                      value={value}
                      onChangeText={onChange}
                      style={[styles.input, { flex: 1 }]}
                    />
                  )}
                />
              </View>
              <Tooltip title="Eliminar integrante">
                <IconButton icon="delete" iconColor="red" size={20} onPress={() => remove(index)} />
              </Tooltip>
            </View>
          ))}
          <Button icon="plus" mode="outlined" onPress={() => append({ nombre: '', cedula: '' })} style={styles.addButton}>
            Añadir Integrante
          </Button>
        </View>
      </List.Accordion>

      <Divider />

      <List.Accordion title="3. Formato" id="3" left={props => <List.Icon {...props} icon="format-list-checks" />}>
        <View style={styles.section}>
          <Tooltip title="Selecciona la norma de formateo a aplicar en todo el documento.">
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text variant="labelLarge">Norma</Text>
                <IconButton icon="information-outline" size={20} onPress={() => setDialogVisible(true)} />
              </View>
              
              <View style={styles.presetRow}>
                <Controller
                  control={control}
                  name="format.mode"
                  render={({ field: { onChange: onModeChange, value: mode } }) => (
                    <Controller
                      control={control}
                      name="format.preset"
                      render={({ field: { onChange: onPresetChange, value: preset } }) => (
                        <>
                          <Button 
                            mode={mode === 'preset' && preset === 'apa' ? 'contained' : 'outlined'} 
                            onPress={() => { onModeChange('preset'); onPresetChange('apa'); }} 
                            style={styles.presetBtn}
                          >
                            APA
                          </Button>
                          <Button 
                            mode={mode === 'preset' && preset === 'upel' ? 'contained' : 'outlined'} 
                            onPress={() => { onModeChange('preset'); onPresetChange('upel'); }} 
                            style={styles.presetBtn}
                          >
                            UPEL
                          </Button>
                          <Button 
                            mode={mode === 'custom' ? 'contained' : 'outlined'} 
                            onPress={() => onModeChange('custom')} 
                            style={styles.presetBtn}
                          >
                            Personalizado
                          </Button>
                        </>
                      )}
                    />
                  )}
                />
              </View>
            </View>
          </Tooltip>

          {formatMode === 'custom' && (
            <View style={styles.customSection}>
              <Text variant="titleMedium" style={{ marginBottom: 8, marginTop: 8 }}>Márgenes (cm)</Text>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {['superior', 'inferior', 'izquierdo', 'derecho'].map(pos => (
                  <Controller
                    key={pos}
                    control={control}
                    name={`format.custom.margenes.${pos}_cm`}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        label={pos.charAt(0).toUpperCase() + pos.slice(1)}
                        mode="outlined"
                        dense
                        keyboardType="numeric"
                        value={String(value)}
                        onChangeText={onChange}
                        style={{ flex: 1, minWidth: '45%' }}
                      />
                    )}
                  />
                ))}
              </View>
              
              <Text variant="titleMedium" style={{ marginBottom: 8, marginTop: 16 }}>Texto General</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Controller
                  control={control}
                  name="format.custom.cuerpo_texto.familia"
                  render={({ field: { onChange, value } }) => (
                    <Menu
                      visible={fontMenuVisible}
                      onDismiss={() => setFontMenuVisible(false)}
                      anchor={
                        <TouchableRipple onPress={() => setFontMenuVisible(true)} style={{ flex: 2 }}>
                          <View pointerEvents="none">
                            <TextInput
                              label="Fuente"
                              mode="outlined"
                              dense
                              value={value}
                              right={<TextInput.Icon icon="chevron-down" />}
                            />
                          </View>
                        </TouchableRipple>
                      }
                    >
                      {FONTS.map(font => (
                        <Menu.Item 
                          key={font} 
                          onPress={() => { onChange(font); setFontMenuVisible(false); }} 
                          title={font} 
                          titleStyle={{ fontFamily: font, fontSize: 16 }}
                        />
                      ))}
                    </Menu>
                  )}
                />
                <Controller
                  control={control}
                  name="format.custom.cuerpo_texto.interlineado"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Interlineado"
                      mode="outlined"
                      dense
                      keyboardType="numeric"
                      value={String(value)}
                      onChangeText={onChange}
                      style={{ flex: 1 }}
                    />
                  )}
                />
              </View>
            </View>
          )}

          <Divider style={{ marginVertical: 12 }} />

          <Tooltip title="Genera un índice automático en la segunda página si se activa.">
            <View style={styles.switchRow}>
              <Text variant="bodyLarge">Incluir Índice General</Text>
              <Controller
                control={control}
                name="format.indice_general"
                render={({ field: { onChange, value } }) => (
                  <Switch value={value} onValueChange={onChange} />
                )}
              />
            </View>
          </Tooltip>
        </View>
      </List.Accordion>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Detalles de las Normas</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{fontWeight: 'bold'}}>Norma APA</Paragraph>
            <Paragraph>
              - Márgenes: 4cm izquierdo y superior, 3cm derecho e inferior.{'\n'}
              - Fuente: Arial 12pt, interlineado 1.5, texto justificado.{'\n'}
              - Sangría en primera línea: 1.25 cm.{'\n'}
              - Títulos (Jerarquía): Negrita, tamaños 14pt (Principal) a 12pt (Menores).
            </Paragraph>
            <Paragraph style={{fontWeight: 'bold', marginTop: 10}}>Norma UPEL</Paragraph>
            <Paragraph>
              - Márgenes: 4cm izquierdo, 3cm superior, inferior y derecho.{'\n'}
              - Fuente: Times New Roman 12pt, interlineado 1.5, texto justificado.{'\n'}
              - Sangría en primera línea: 1.27 cm.{'\n'}
              - Títulos (Jerarquía): Mayúsculas, negrita y centrado (Niveles 1 y 2).
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cerrar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </List.AccordionGroup>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  input: {
    marginBottom: 8,
  },
  integranteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  integranteInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  presetBtn: {
    flex: 1,
    paddingHorizontal: 0,
  },
  customSection: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f5f5f5', // This works well for a subtle background, standard RN styling
    borderRadius: 8,
  }
});
