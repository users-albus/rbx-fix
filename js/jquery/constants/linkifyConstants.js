export default {
  cssClass: "text-link",
  hasProtocolRegex: /(https?:\/\/)/,
  regex:
    /(https?:\/\/)?(?:www\.)?([a-z0-9-]{2,}\.)*(((m|de|www|web|api|blog|wiki|corp|polls|bloxcon|developer|devforum|forum|status)\.roblox\.com|robloxlabs\.com)|(www\.shoproblox\.com)|(roblox\.status\.io)|(rblx\.co)|help\.roblox\.com(?![A-Za-z0-9/.]*\/attachments\/))(?!\/[A-Za-z0-9-+&@#/=~_|!:,.;]*%)((\/[A-Za-z0-9-+&@#/%?=~_|!:,.;]*)|(?=\s|\b))/gm,
  doNotUpgradeToHttpsRegex: /(([^.]help|polls)\.roblox\.com)/,
  robloxDomainSuffixes: [".roblox.com", ".robloxlabs.com"],
};
