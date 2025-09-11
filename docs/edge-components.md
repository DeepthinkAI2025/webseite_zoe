# Edge Components Documentation

## Übersicht

Dieses Dokument beschreibt die standardisierten Edge-Komponenten der ZOE Solar Webseite. Alle Komponenten folgen einheitlichen Patterns für Accessibility, Props-API und moderne React-Practices.

## Standardisierte Komponenten

### 1. ServiceDrawer

**Zweck**: Seitliche Drawer-Komponente für Service-Navigation

**Standort**: `src/components/ServiceDrawer.jsx`

**Props API**:
```jsx
<ServiceDrawer
  isOpen={boolean}        // Steuert Sichtbarkeit
  onToggle={function}     // Callback bei Toggle
  onClose={function}      // Callback bei Schließen
  className={string}      // Zusätzliche CSS-Klassen
/>
```

**Features**:
- ✅ FocusLock für Fokus-Trap
- ✅ ESC Handler für Tastaturbedienung
- ✅ Motion Reduction Support (prefers-reduced-motion)
- ✅ ARIA Modal Pattern (role="dialog", aria-modal)
- ✅ Responsive Design (Desktop: offen, Mobile: geschlossen)

### 2. SupportChatDrawer

**Zweck**: Chat-Modal für Support-Anfragen

**Standort**: `src/components/SupportChatDrawer.jsx`

**Props API**:
```jsx
<SupportChatDrawer
  isOpen={boolean}        // Steuert Sichtbarkeit
  onToggle={function}     // Callback bei Toggle
  onClose={function}      // Callback bei Schließen
  className={string}      // Zusätzliche CSS-Klassen
/>
```

**Features**:
- ✅ FocusLock für Fokus-Trap
- ✅ ESC Handler für Tastaturbedienung
- ✅ Motion Reduction Support
- ✅ ARIA Modal Pattern
- ✅ Live Region für Screenreader (aria-live="polite")

### 3. PopupBanners

**Zweck**: Timed und Exit-Intent Popups

**Standort**: `src/components/PopupBanners.jsx`

**Props API**:
```jsx
<PopupBanners
  className={string}      // Zusätzliche CSS-Klassen
/>
```

**Features**:
- ✅ FocusLock in Backdrop
- ✅ ESC Handler
- ✅ Motion Reduction Support
- ✅ ARIA Modal Pattern
- ✅ Backdrop-Click zum Schließen

### 4. SmartPlanner

**Zweck**: Interaktiver 3-Schritt-Planer für Solar-Angebote

**Standort**: `src/components/SmartPlanner.jsx`

**Props API**:
```jsx
<SmartPlanner
  onResult={function}     // Callback mit Ergebnis
  persona={string}        // 'privat' oder 'gewerbe'
  onClose={function}      // Callback bei Schließen
  onToggle={function}     // Callback bei Toggle
  className={string}      // Zusätzliche CSS-Klassen
/>
```

**Features**:
- ✅ ESC Handler
- ✅ Motion Reduction Support
- ✅ Progressive Enhancement (funktioniert ohne JS)
- ✅ Tracking Integration (dataLayer)

## Gemeinsame Patterns

### Accessibility Patterns

**Fokus-Management**:
- Alle modalen Komponenten verwenden `react-focus-lock`
- Automatischer Fokus-Rückgabe beim Schließen
- Fokus-Trap verhindert Navigation außerhalb der Komponente

**Tastaturbedienung**:
- ESC schließt alle modalen Komponenten
- Tab-Navigation bleibt innerhalb der Komponente
- Screenreader-Unterstützung mit ARIA-Attributen

**Motion Reduction**:
- Automatische Erkennung von `prefers-reduced-motion`
- Reduzierte Animationen für Benutzer mit Vestibularstörungen
- Graceful Degradation ohne JavaScript

### Props Patterns

**Konsistente API**:
- `isOpen` / `onToggle` / `onClose` für Zustandsmanagement
- `className` für Styling-Erweiterungen
- Callback-Props für externe Zustandsverwaltung

**Type Safety**:
- Alle Props haben Default-Werte
- Konsistente Typisierung mit PropTypes oder TypeScript

### Testing

**Visual Regression**:
- Playwright-Tests für alle Komponenten
- Snapshot-Tests für verschiedene Zustände
- Motion Reduction Tests

**Accessibility Tests**:
- Axe-Core Integration
- Fokus-Order Tests
- ARIA-Pattern Validierung

## Migration Guide

### Von alten zu neuen Komponenten

**Alte Verwendung**:
```jsx
// Vorher: Keine Props, direkte Zustandsverwaltung
<ServiceDrawer />
```

**Neue Verwendung**:
```jsx
// Nachher: Kontrollierte Props
<ServiceDrawer
  isOpen={isDrawerOpen}
  onToggle={handleDrawerToggle}
  onClose={handleDrawerClose}
/>
```

### Vorteile der Standardisierung

1. **Konsistenz**: Einheitliche API über alle Komponenten
2. **Testbarkeit**: Einfachere Unit- und Integrationstests
3. **Wartbarkeit**: Zentralisierte Logik für gemeinsame Patterns
4. **Accessibility**: Garantierte Barrierefreiheit durch Standards
5. **Performance**: Optimierte Fokus-Management und Animationen

## Performance Impact

- **Bundle Size**: Minimale Auswirkungen durch Tree-Shaking
- **Runtime Performance**: Optimierte Fokus-Management
- **Accessibility**: Verbesserte Screenreader-Unterstützung
- **User Experience**: Konsistente Interaktionen

## Future Enhancements

- **TypeScript Migration**: Vollständige Typisierung
- **Compound Components**: Verbesserte API für komplexe Use-Cases
- **Animation Library**: Konsistente Animationen mit Framer Motion
- **Theme Integration**: Dark Mode Support für alle Komponenten
