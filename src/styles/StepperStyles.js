import {StyleSheet} from "react-native"

export const Stepperstyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 8,
  },
  stepIndicatorWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  indicatorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  indicatorActive: {
    backgroundColor: '#032551',
  },
  indicatorComplete: {
    backgroundColor: '#059669',
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  indicatorTextActive: {
    color: '#ffffff',
  },
  indicatorLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  indicatorLabelActive: {
    color: '#032551',
    fontWeight: 'bold',
  },
  bodyContainer: {
    minHeight: 180,
    marginVertical: 10,
  },
  stepContainer: {
    width: '100%',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
    marginTop: 10,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  backButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#032551',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#032551',
    marginLeft: 'auto',
    shadowColor: '#032551',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  nextButtonText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    opacity: 0.6,
  },
});