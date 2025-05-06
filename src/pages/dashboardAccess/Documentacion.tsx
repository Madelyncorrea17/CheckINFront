/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/index.scss';
import * as MUI from "@mui/material";
import * as Icons from "@mui/icons-material";
import SideBar from '../../components/SideBar';
import DashboardAppBar from '../../components/DashboardAppBar';

// Interfaces
interface Documento {
  id: string;
  nombre: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  fechaSubida?: string;
  url?: string;
  icono: JSX.Element;
}

interface Estudiante {
  id: string;
  nombre: string;
  empresa: string;
  documentos: {
    id_doc: Documento;
    cv_doc: Documento;
    anexo_iv_doc: Documento;
    anexo_v_doc: Documento;
    acta_nac_doc: Documento;
    ced_padres_doc: Documento;
    vac_covid_doc: Documento;
  };
}

function Documentacion() {
  const theme = MUI.useTheme();
  const isMobile = MUI.useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const notifications = 4;

  // Simulación de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setEstudiantes([
        {
          id: '1',
          nombre: 'Juan Pérez',
          empresa: 'Empresa A',
          documentos: {
            id_doc: { 
              id: 'id1', 
              nombre: 'Documento de Identidad', 
              estado: 'Aprobado', 
              fechaSubida: '2024-03-15',
              icono: <Icons.Badge fontSize="large" />
            },
            cv_doc: { 
              id: 'cv1', 
              nombre: 'Currículum Vitae', 
              estado: 'Aprobado', 
              fechaSubida: '2024-03-15',
              icono: <Icons.Description fontSize="large" />
            },
            anexo_iv_doc: { 
              id: 'anexo4', 
              nombre: 'Anexo IV', 
              estado: 'Pendiente',
              icono: <Icons.Assignment fontSize="large" />
            },
            anexo_v_doc: { 
              id: 'anexo5', 
              nombre: 'Anexo V', 
              estado: 'Rechazado', 
              fechaSubida: '2024-03-14',
              icono: <Icons.Assignment fontSize="large" />
            },
            acta_nac_doc: { 
              id: 'acta1', 
              nombre: 'Acta de Nacimiento', 
              estado: 'Aprobado', 
              fechaSubida: '2024-03-13',
              icono: <Icons.Article fontSize="large" />
            },
            ced_padres_doc: { 
              id: 'ced1', 
              nombre: 'Cédula de Padres', 
              estado: 'Pendiente',
              icono: <Icons.People fontSize="large" />
            },
            vac_covid_doc: { 
              id: 'vac1', 
              nombre: 'Vacuna COVID', 
              estado: 'Aprobado', 
              fechaSubida: '2024-03-12',
              icono: <Icons.Vaccines fontSize="large" />
            }
          }
        },
        {
          id: '2',
          nombre: 'María López',
          empresa: 'Empresa B',
          documentos: {
            id_doc: { 
              id: 'id2', 
              nombre: 'Documento de Identidad', 
              estado: 'Pendiente',
              icono: <Icons.Badge fontSize="large" />
            },
            cv_doc: { 
              id: 'cv2', 
              nombre: 'Currículum Vitae', 
              estado: 'Pendiente',
              icono: <Icons.Description fontSize="large" />
            },
            anexo_iv_doc: { 
              id: 'anexo4_2', 
              nombre: 'Anexo IV', 
              estado: 'Pendiente',
              icono: <Icons.Assignment fontSize="large" />
            },
            anexo_v_doc: { 
              id: 'anexo5_2', 
              nombre: 'Anexo V', 
              estado: 'Pendiente',
              icono: <Icons.Assignment fontSize="large" />
            },
            acta_nac_doc: { 
              id: 'acta2', 
              nombre: 'Acta de Nacimiento', 
              estado: 'Pendiente',
              icono: <Icons.Article fontSize="large" />
            },
            ced_padres_doc: { 
              id: 'ced2', 
              nombre: 'Cédula de Padres', 
              estado: 'Pendiente',
              icono: <Icons.People fontSize="large" />
            },
            vac_covid_doc: { 
              id: 'vac2', 
              nombre: 'Vacuna COVID', 
              estado: 'Pendiente',
              icono: <Icons.Vaccines fontSize="large" />
            }
          }
        }
      ]);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleVerDocumentos = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEstudiante(null);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Aprobado':
        return theme.palette.success.main;
      case 'Rechazado':
        return theme.palette.error.main;
      default:
        return theme.palette.warning.main;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, tipoDocumento: string) => {
    const file = event.target.files?.[0];
    if (file && selectedEstudiante) {
      // Aquí iría la lógica para subir el archivo
      console.log(`Subiendo ${tipoDocumento} para ${selectedEstudiante.nombre}`);
    }
  };

  const filteredEstudiantes = estudiantes.filter(estudiante => {
    const matchesSearch = estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estudiante.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'todos') return matchesSearch;
    
    const documentosCompletos = Object.values(estudiante.documentos).filter(doc => doc.estado === 'Aprobado').length;
    const totalDocumentos = Object.keys(estudiante.documentos).length;
    const estadoGeneral = documentosCompletos === totalDocumentos ? 'Completo' : 
                         documentosCompletos === 0 ? 'Faltante' : 'Parcial';
    
    return matchesSearch && estadoGeneral.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <MUI.Box sx={{ display: 'flex', width: '100vw', minHeight: '100vh', bgcolor: MUI.alpha(theme.palette.background.paper, 0.6), p: 0 }}>
      {/* Sidebar */}
      <SideBar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

      {/* Main content */}
      <MUI.Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* App bar */}
        <DashboardAppBar notifications={notifications} toggleDrawer={toggleDrawer} />

        {/* Loading overlay */}
        {loading && (
          <MUI.Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.8)',
            zIndex: 9999
          }}>
            <MUI.CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
          </MUI.Box>
        )}

        {/* Encabezado */}
        <MUI.Box sx={{ p: { xs: 2, md: 4 } }}>
          <MUI.Typography variant="h2" sx={{ 
            mb: 1, 
            fontWeight: 'bold', 
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Icons.Description sx={{ fontSize: '2.5rem' }} />
            Documentación de Estudiantes
          </MUI.Typography>
          <MUI.Typography variant="body1" color="text.secondary">
            Gestiona y revisa la documentación de los estudiantes en pasantías
          </MUI.Typography>
        </MUI.Box>

        {/* Filtros y Búsqueda */}
        <MUI.Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <MUI.TextField
            placeholder="Buscar estudiante o empresa..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: <Icons.Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          <MUI.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MUI.MenuItem value="todos">Todos los estados</MUI.MenuItem>
            <MUI.MenuItem value="completo">Completo</MUI.MenuItem>
            <MUI.MenuItem value="parcial">Parcial</MUI.MenuItem>
            <MUI.MenuItem value="faltante">Faltante</MUI.MenuItem>
          </MUI.Select>
        </MUI.Box>

        {/* Tabla de Documentación */}
        <MUI.Box sx={{ p: { xs: 2, md: 4 } }}>
          <MUI.Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }
            }}
          >
            <MUI.TableContainer>
              <MUI.Table>
                <MUI.TableHead>
                  <MUI.TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <MUI.TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estudiante</MUI.TableCell>
                    <MUI.TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Empresa</MUI.TableCell>
                    <MUI.TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Documentos</MUI.TableCell>
                    <MUI.TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado General</MUI.TableCell>
                    <MUI.TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</MUI.TableCell>
                  </MUI.TableRow>
                </MUI.TableHead>
                <MUI.TableBody>
                  {filteredEstudiantes.map((estudiante, index) => {
                    const documentosCompletos = Object.values(estudiante.documentos).filter(doc => doc.estado === 'Aprobado').length;
                    const totalDocumentos = Object.keys(estudiante.documentos).length;
                    const estadoGeneral = documentosCompletos === totalDocumentos ? 'Completo' : 
                                        documentosCompletos === 0 ? 'Faltante' : 'Parcial';

                    return (
                      <MUI.TableRow 
                        key={estudiante.id} 
                        hover
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: MUI.alpha(theme.palette.primary.main, 0.05)
                          }
                        }}
                      >
                        <MUI.TableCell>
                          <MUI.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MUI.Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                              {estudiante.nombre.charAt(0)}
                            </MUI.Avatar>
                            {estudiante.nombre}
                          </MUI.Box>
                        </MUI.TableCell>
                        <MUI.TableCell>
                          <MUI.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icons.Business sx={{ color: 'text.secondary' }} />
                            {estudiante.empresa}
                          </MUI.Box>
                        </MUI.TableCell>
                        <MUI.TableCell>
                          <MUI.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icons.Description sx={{ color: 'text.secondary' }} />
                            {documentosCompletos}/{totalDocumentos} documentos
                          </MUI.Box>
                        </MUI.TableCell>
                        <MUI.TableCell>
                          <MUI.Chip 
                            label={estadoGeneral}
                            color={
                              estadoGeneral === 'Completo' ? 'success' :
                              estadoGeneral === 'Faltante' ? 'error' : 'warning'
                            }
                            size="small"
                            icon={
                              estadoGeneral === 'Completo' ? <Icons.CheckCircle /> :
                              estadoGeneral === 'Faltante' ? <Icons.Error /> : <Icons.Warning />
                            }
                          />
                        </MUI.TableCell>
                        <MUI.TableCell>
                          <MUI.Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<Icons.Visibility />}
                            onClick={() => handleVerDocumentos(estudiante)}
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                              }
                            }}
                          >
                            Ver Documentos
                          </MUI.Button>
                        </MUI.TableCell>
                      </MUI.TableRow>
                    );
                  })}
                </MUI.TableBody>
              </MUI.Table>
            </MUI.TableContainer>
          </MUI.Paper>
        </MUI.Box>

        {/* Diálogo de Documentos */}
        <MUI.Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          TransitionComponent={MUI.Slide}
          TransitionProps={{ direction: 'up' }}
        >
          {selectedEstudiante && (
            <>
              <MUI.DialogTitle sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <MUI.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MUI.Avatar sx={{ bgcolor: 'white', color: theme.palette.primary.main }}>
                    {selectedEstudiante.nombre.charAt(0)}
                  </MUI.Avatar>
                  <MUI.Typography variant="h6">
                    Documentos de {selectedEstudiante.nombre}
                  </MUI.Typography>
                </MUI.Box>
                <MUI.IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                  <Icons.Close />
                </MUI.IconButton>
              </MUI.DialogTitle>
              <MUI.DialogContent sx={{ mt: 2 }}>
                <MUI.Grid container spacing={2}>
                  {Object.entries(selectedEstudiante.documentos).map(([key, doc]) => (
                    <MUI.Grid item xs={12} sm={6} key={doc.id}>
                      <MUI.Paper 
                        elevation={2} 
                        sx={{ 
                          p: 2,
                          borderRadius: 2,
                          border: `1px solid ${getEstadoColor(doc.estado)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <MUI.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <MUI.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MUI.Box sx={{ 
                              color: getEstadoColor(doc.estado),
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              {doc.icono}
                            </MUI.Box>
                            <MUI.Typography variant="subtitle1" fontWeight="bold">
                              {doc.nombre}
                            </MUI.Typography>
                          </MUI.Box>
                          <MUI.Chip 
                            label={doc.estado}
                            color={
                              doc.estado === 'Aprobado' ? 'success' :
                              doc.estado === 'Rechazado' ? 'error' : 'warning'
                            }
                            size="small"
                            icon={
                              doc.estado === 'Aprobado' ? <Icons.CheckCircle /> :
                              doc.estado === 'Rechazado' ? <Icons.Error /> : <Icons.Warning />
                            }
                          />
                        </MUI.Box>
                        
                        {doc.fechaSubida && (
                          <MUI.Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <Icons.CalendarToday sx={{ fontSize: '0.875rem', mr: 0.5, verticalAlign: 'middle' }} />
                            Subido el: {new Date(doc.fechaSubida).toLocaleDateString()}
                          </MUI.Typography>
                        )}

                        <MUI.Box sx={{ display: 'flex', gap: 1 }}>
                          <MUI.Button
                            variant="outlined"
                            size="small"
                            startIcon={<Icons.Upload />}
                            component="label"
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            Subir
                            <input
                              type="file"
                              hidden
                              onChange={(e) => handleFileUpload(e, key)}
                            />
                          </MUI.Button>
                          
                          {doc.url && (
                            <MUI.Button
                              variant="outlined"
                              size="small"
                              startIcon={<Icons.Visibility />}
                              onClick={() => window.open(doc.url, '_blank')}
                              sx={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              Ver
                            </MUI.Button>
                          )}
                        </MUI.Box>
                      </MUI.Paper>
                    </MUI.Grid>
                  ))}
                </MUI.Grid>
              </MUI.DialogContent>
              <MUI.DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <MUI.Button 
                  onClick={handleCloseDialog} 
                  color="primary"
                  startIcon={<Icons.Close />}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  Cerrar
                </MUI.Button>
              </MUI.DialogActions>
            </>
          )}
        </MUI.Dialog>
      </MUI.Box>
    </MUI.Box>
  );
}

export default Documentacion; 