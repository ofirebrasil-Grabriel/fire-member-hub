import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
  Svg,
  Circle,
  Path,
  Rect,
  Image,
} from '@react-pdf/renderer';
import { OutputMetricValue } from '@/services/dayEngine';

// Register custom fonts
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-mediumitalic-webfont.ttf',
      fontWeight: 500,
      fontStyle: 'italic',
    },
  ],
});

// Design System Premium
const colors = {
  // Primary
  fireOrange: '#FF6B35',
  fireOrangeLight: '#FF8555',
  fireOrangeDark: '#E5521A',
  fireAmber: '#FFB800',

  // Neutrals - mais suaves
  darkBg: '#1A1D29',
  gray900: '#0F172A',
  gray800: '#1E293B',
  gray700: '#334155',
  gray600: '#475569',
  gray500: '#64748B',
  gray400: '#94A3B8',
  gray300: '#CBD5E1',
  gray200: '#E2E8F0',
  gray100: '#F1F5F9',
  gray50: '#F8FAFC',
  white: '#FFFFFF',

  // Semantic
  success: '#10B981',
  successLight: '#D1FAE5',

  // Accent oranges
  orange50: '#FFF7ED',
  orange100: '#FFEDD5',

  // Gradients (approximations)
  orangeGradientStart: '#FF6B35',
  orangeGradientEnd: '#FFB800',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  mega: 48,
};

const typography = {
  hero: 32,        // Título do dia
  displayLarge: 32,
  displayMedium: 24,
  h1: 20,
  h2: 16,
  h3: 14,
  h4: 12,
  body: 11,
  bodySmall: 10,
  caption: 9,
  tiny: 7,
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    backgroundColor: colors.white,
    fontSize: typography.body,
    color: colors.gray700,
  },

  // Header compacto e elegante
  header: {
    backgroundColor: colors.darkBg,
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logo: {
    color: colors.fireOrange,
    fontSize: 42,
    fontWeight: 700,
    letterSpacing: -0.3,
  },
  logoSub: {
    color: colors.gray400,
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: 1.2,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  // Badge do dia - MUITO menor e discreto
  dayBadge: {
    backgroundColor: colors.fireOrange,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
  },
  dayBadgeNumber: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: -0.5,
  },

  // Accent line com gradiente visual
  accentLine: {
    height: 4,
    backgroundColor: colors.fireOrange,
  },

  // Hero section - Título do dia GRANDE
  heroSection: {
    backgroundColor: colors.gray50,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  heroTitle: {
    color: colors.gray900,
    fontSize: typography.hero,
    fontWeight: 700,
    letterSpacing: -1,
    lineHeight: 1.2,
    marginBottom: spacing.sm,
  },
  heroAccent: {
    width: 60,
    height: 4,
    backgroundColor: colors.fireOrange,
    borderRadius: 2,
  },

  // Content
  content: {
    padding: spacing.xxxl,
    paddingBottom: 85,
  },

  // Status row refinada
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.mega,
    gap: spacing.xl,
  },
  completionBadge: {
    backgroundColor: colors.success,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusIcon: {
    width: 16,
    height: 16,
  },
  completionText: {
    color: colors.white,
    fontSize: typography.bodySmall,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  dateText: {
    color: colors.gray500,
    fontSize: typography.body,
    fontWeight: 500,
  },
  xpBadge: {
    backgroundColor: colors.fireAmber,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  xpText: {
    color: colors.gray900,
    fontSize: typography.body,
    fontWeight: 700,
  },

  // Section elegante - sem bullet
  section: {
    marginBottom: spacing.huge,
  },
  sectionHeader: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: 700,
    color: colors.gray800,
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.caption,
    color: colors.gray500,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Metrics grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.gray200,
  },
  metricLabel: {
    color: colors.gray500,
    fontSize: typography.caption,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  metricValue: {
    color: colors.gray900,
    fontSize: typography.displayMedium,
    fontWeight: 700,
    letterSpacing: -0.5,
  },

  // Analysis box - muito mais elegante
  analysisBox: {
    backgroundColor: colors.gray50,
    borderRadius: 12,
    padding: spacing.xl,
    borderLeftWidth: 6,
    borderColor: colors.fireOrange,
    position: 'relative',
  },
  analysisAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 5,
    height: '100%',
    backgroundColor: colors.fireOrange,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  analysisIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: colors.orange50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  analysisIcon: {
    width: 20,
    height: 20,
  },
  analysisText: {
    color: colors.gray700,
    fontSize: typography.body,
    lineHeight: 1.8,
    fontWeight: 400,
  },

  // Quote refinada
  quoteSection: {
    marginTop: spacing.xxxl,
  },
  quoteBox: {
    backgroundColor: colors.gray50,
    borderRadius: 16,
    padding: spacing.xxl,
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  quoteIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: colors.fireOrange,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  quoteIcon: {
    width: 24,
    height: 24,
  },
  quoteText: {
    color: colors.gray700,
    fontSize: typography.h3,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 1.6,
    fontWeight: 500,
  },

  // Footer sofisticado
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: colors.gray50,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerBrand: {
    color: colors.gray700,
    fontSize: typography.bodySmall,
    fontWeight: 700,
    marginBottom: 2,
  },
  footerUrl: {
    color: colors.gray500,
    fontSize: typography.caption,
    fontWeight: 500,
  },
  footerDecor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 80,
    height: 4,
    backgroundColor: colors.fireOrange,
  },
  footerDecorRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 4,
    backgroundColor: colors.fireOrange,
  },
});

interface ReportData {
  dayId: number;
  dayTitle: string;
  completedAt: string;
  metrics: OutputMetricValue[];
  formData: Record<string, unknown>;
  analysis: string;
  userName?: string;
  motivationPhrase?: string;
  xpEarned?: number;
}

// Componentes de ícones SVG
const CheckIcon: React.FC = () => (
  <Svg style={styles.statusIcon} viewBox="0 0 24 24">
    <Path
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      fill={colors.white}
    />
  </Svg>
);

// Flame logo icon (simplified from the original logo)
const FlameIcon: React.FC = () => (
  <Svg viewBox="0 0 24 32" style={{ width: 24, height: 32 }}>
    <Path
      d="M12 0C12 0 4 8 4 16C4 22 8 26 12 28C16 26 20 22 20 16C20 8 12 0 12 0Z"
      fill={colors.fireOrange}
    />
    <Path
      d="M12 8C12 8 8 12 8 18C8 22 10 24 12 26C14 24 16 22 16 18C16 12 12 8 12 8Z"
      fill={colors.fireAmber}
    />
  </Svg>
);

const SparklesIcon: React.FC = () => (
  <Svg style={styles.statusIcon} viewBox="0 0 24 24">
    <Path
      d="M12 2L9.19 8.63L2 11.04l5.46 4.73L5.82 23L12 19.18L18.18 23l-1.64-7.23L22 11.04l-7.19-2.41L12 2z"
      fill={colors.gray900}
    />
  </Svg>
);

const LightbulbIcon: React.FC = () => (
  <Svg style={styles.analysisIcon} viewBox="0 0 24 24">
    <Path
      d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"
      fill={colors.fireOrange}
    />
  </Svg>
);

const QuoteIcon: React.FC = () => (
  <Svg style={styles.quoteIcon} viewBox="0 0 24 24">
    <Path
      d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"
      fill={colors.white}
    />
  </Svg>
);

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatMetricValue = (metric: OutputMetricValue): string => {
  switch (metric.format) {
    case 'currency':
      return formatCurrency(Number(metric.value) || 0);
    case 'percent':
      return `${metric.value}%`;
    case 'number':
      return String(metric.value);
    default:
      return String(metric.value);
  }
};

const DayReportDocument: React.FC<{ data: ReportData }> = ({ data }) => {
  const formattedDate = new Date(data.completedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Document
      title={`FIRE 15D - Dia ${data.dayId} - ${data.dayTitle}`}
      author="O Fire Brasil"
      subject="Relatório do Desafio"
      creator="FIRE 15D"
    >
      <Page size="A4" style={styles.page}>
        {/* Header compacto */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>FIRE</Text>
              <Text style={styles.logoSub}>15 DIAS</Text>
            </View>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>DIA</Text>
              <Text style={styles.dayBadgeNumber}>{data.dayId}</Text>
            </View>
          </View>
        </View>

        {/* Accent line */}
        <View style={styles.accentLine} />

        {/* Hero section - Título do dia em DESTAQUE */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>{data.dayTitle}</Text>
          <View style={styles.heroAccent} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Status row */}
          <View style={styles.statusRow}>
            <View style={styles.completionBadge}>
              <CheckIcon />
              <Text style={styles.completionText}>DESAFIO CONCLUÍDO</Text>
            </View>
            <Text style={styles.dateText}>{formattedDate}</Text>
            {data.xpEarned && (
              <View style={styles.xpBadge}>
                <SparklesIcon />
                <Text style={styles.xpText}>+{data.xpEarned} XP</Text>
              </View>
            )}
          </View>

          {/* Metrics Section */}
          {data.metrics.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Métricas do Dia</Text>
                <Text style={styles.sectionSubtitle}>Seus números conquistados</Text>
              </View>
              <View style={styles.metricsGrid}>
                {data.metrics.map((metric, index) => (
                  <View key={index} style={styles.metricCard}>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    <Text style={styles.metricValue}>
                      {formatMetricValue(metric)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Analysis Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Análise Personalizada</Text>
              <Text style={styles.sectionSubtitle}>Insights sobre seu progresso</Text>
            </View>
            <View style={styles.analysisBox}>
              <Text style={styles.analysisText}>{data.analysis}</Text>
            </View>
          </View>

          {/* Motivation Quote */}
          {data.motivationPhrase && (
            <View style={styles.quoteSection}>
              <View style={styles.quoteBox}>
                <View style={styles.quoteIconContainer}>
                  <QuoteIcon />
                </View>
                <Text style={styles.quoteText}>{data.motivationPhrase}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDecor} />
          <View style={styles.footerContent}>
            <Text style={styles.footerBrand}>Gerado pelo FIRE 15D</Text>
            <Text style={styles.footerUrl}>www.ofirebrasil.com.br</Text>
          </View>
          <View style={styles.footerDecorRight} />
        </View>
      </Page>
    </Document>
  );
};

export async function generateDayReport(data: ReportData): Promise<void> {
  const blob = await pdf(<DayReportDocument data={data} />).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fire15d_dia${data.dayId}_${data.dayTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export { DayReportDocument };
