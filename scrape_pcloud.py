from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome(r'C:\Users\Jet_g\Downloads\chromedriver.exe')

driver.get('chrome://downloads')
driver.execute_script('window.open("https://my.pcloud.com/","_blank");')
driver.switch_to.window(driver.window_handles[1])

# Sign in
WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CSS_SELECTOR, '.login-input-email'))).send_keys('chat@kamiak.org')
driver.find_element('css selector', '.login-input-password').send_keys('9pHH_@KyaBg3E-5')
driver.find_element('css selector', '.butt.submitbut').click()

# Download stuff
x = driver.find_elements('css selector', '.filename')
# x[0].click()

# Switch to chrome downloads
driver.switch_to.window(driver.window_handles[0])
